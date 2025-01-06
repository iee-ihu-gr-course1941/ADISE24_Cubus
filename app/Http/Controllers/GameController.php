<?php

namespace App\Http\Controllers;

use App\Enums\GameSessionState;
use App\Events\BoardUpdateEvent;
use App\Models\GameSession;
use Illuminate\Http\Request;
use function GuzzleHttp\json_encode;

const RELATIVE_MATRIX_SIZE = 5;
const MATRIX_BORDER_SIZE = 1;
const RELATIVE_MATRIX_SIZE_WITH_BORDER = RELATIVE_MATRIX_SIZE + MATRIX_BORDER_SIZE * 2;

const SCORE_LAST_PIECE_MONONIMINO = 20;
const SCORE_PLACE_ALL_PIECES = 15;

class GameController extends Controller {
    function index(Request $request): \Inertia\Response | \Inertia\ResponseFactory | \Illuminate\Http\Response {
        $player = AuthService::getUser();
        $current_session = $player->getCurrentSession();

        $visualize_game = $request->hasHeader('GAME');

        if($request->expectsJson() && $visualize_game) {
            return response(
                $current_session->visualizeGameHeader() .
                "\n" .
                $current_session->visualizeBoard() .
                "\n" .
                $current_session->visualizeGameFooter($player)
            );
        }

        $public_player_data = $player->getPublic();
        $public_player_data['session_color'] = $player->getCurrentSessionColor()->value;
        $public_player_data['session_valid_pieces'] = json_decode($current_session['player_'.$player->getCurrentSessionColor()->value.'_inventory']);

        if($request->expectsJson()) {
            return response([
                'session' => $current_session->getPublic(),
                'player' => $public_player_data,
            ]);
        }

        return inertia('Game', [
            'user' => $player->getPublic(),
            'userSession' => [
                'session' => $current_session->getPublic(),
                'player' => $public_player_data,
            ]
        ]);
    }

    function move(Request $request): \Inertia\Response | \Inertia\ResponseFactory | \Illuminate\Http\Response {
        $player = AuthService::getUser();
        $player_color = $player->getCurrentSessionColor()->value;
        $current_session = $player->getCurrentSession();
        $board = json_decode($current_session['board_state']);
        $player_available_pieces = json_decode($current_session['player_'.$player_color.'_inventory']);

        if($current_session['session_state'] !== GameSessionState::Playing->value) {
            if($request->expectsJson()) {
                return response([
                    'valid' => false,
                    'board' => $board,
                    'message' => 'The game hasn\'t started yet'
                ])->setStatusCode(400);
            } else {
                return inertia('Game')->with('flash', 'The game hasn\'t started yet');
            }
        }

        if($current_session['current_playing'] !== $player_color) {
            if($request->expectsJson()) {
                return response([
                    'valid' => false,
                    'board' => $board,
                    'message' => 'It isn\'t your turn.'
                ])->setStatusCode(400);
            } else {
                return inertia('Game')->with('flash', 'It isn\'t your turn.');
            }
        }

        $board_size = count($board);
        $data = $request->validate([
            'code' => 'required|int|between:0,20',
            'origin_x' => 'required|int|between:0,'.$board_size - 1,
            'origin_y' => 'required|int|between:0,'.$board_size - 1,
            'rotation' => 'required|int|between:0,3',
            'flip' => 'required|boolean',
        ]);

        if(!$player_available_pieces[(int)$data['code']]) {
            if($request->expectsJson()) {
                return response([
                    'valid' => false,
                    'board' => $board,
                    'message' => 'The piece is not available to you'
                ])->setStatusCode(400);
            } else {
                return inertia('Game')->with('flash', 'The piece is not available to you');
            }
        }


        $pieces_object = $this->getAllPieceParts();

        $piece_code = (string)$data['code'];
        $piece_parts = $pieces_object->$piece_code;
        $piece = $this->getPieceMatrix($piece_parts);
        if($data['flip']) $this->flipPiece($piece);
        for($i = 0; $i < $data['rotation']; $i++) {
            $this->rotatePiece($piece, $data['flip']);
        }

        $origin_offset = $this->identifyOriginOffset($piece);
        $origin_offset['y'] = $data['origin_y'] - $origin_offset['y'];
        $origin_offset['x'] = $data['origin_x'] - $origin_offset['x'];

        $move_validations = $this->validateMove($board, $piece, $origin_offset, $player_color[0]);

        $is_valid = $move_validations['is_valid'] && (
            $current_session['current_round'] < $current_session['player_count'] && $move_validations['is_touching_board_corner'] ||
            $current_session['current_round'] >= $current_session['player_count'] && $move_validations['is_touching_adjacent']);


        $player_available_pieces[(int)$data['code']] = false;

        if(count($current_session->getPlayingPlayerColors()) === 0) {
            $current_session['session_state'] = GameSessionState::Complete;
        } else {
            $current_session['current_round'] = $current_session['current_round'] + 1;
        }

        if($is_valid) {
            $this->update_board($board, $piece, $origin_offset, $player_color[0]);

            if(!$this->hasValidMoves($board, $player_color[0], $player_available_pieces)) {
                $current_session['player_'.$player_color.'_has_finished'] = true;
            }

            $current_session['player_'.$player_color.'_inventory'] = $player_available_pieces;
            $addedScore = $this->calculateAddedScore(
                $piece_code,
                $piece_parts,
                $current_session['player_'.$player_color.'_has_finished'],
                $player_available_pieces
            );

            $current_session['player_'.$player_color.'_points'] += $addedScore;
            $current_session['board_state'] = json_encode($board);
            $current_session['current_playing'] = $current_session->getNextPlayingColor();
            $current_session->save();
        }

        $piece_parts_offset = array_map(fn($part) => [
               'x' => $part->x + $origin_offset['x'],
               'y' => $part->y + $origin_offset['y'],
        ], $piece_parts);

        if($is_valid) broadcast(new BoardUpdateEvent($current_session, $player['id'], $player_color, $data['origin_x'], $data['origin_y'], $piece_code, $piece_parts_offset))->toOthers();
        return response(['valid' => $is_valid, 'origin_x' => $data['origin_x'], 'origin_y' => $data['origin_y'], 'block_positions' => $piece_parts_offset]);
    }

    function validate(Request $request): \Inertia\Response | \Inertia\ResponseFactory | \Illuminate\Http\Response {
        $player = AuthService::getUser();
        $player_color = $player->getCurrentSessionColor()->value;
        $current_session = $player->getCurrentSession();
        $board = json_decode($current_session['board_state']);
        $player_available_pieces = json_decode($current_session['player_'.$player_color.'_inventory']);

        if($current_session['session_state'] !== GameSessionState::Playing->value) {
            if($request->expectsJson()) {
                return response([
                    'valid' => false,
                    'board' => $board,
                    'message' => 'The game hasn\'t started yet'
                ])->setStatusCode(400);
            } else {
                return inertia('Game')->with('flash', 'The game hasn\'t started yet');
            }
        }

        if($current_session['current_playing'] !== $player_color) {
            if($request->expectsJson()) {
                return response([
                    'valid' => false,
                    'board' => $board,
                    'message' => 'It isn\'t your turn.'
                ])->setStatusCode(400);
            } else {
                return inertia('Game')->with('flash', 'It isn\'t your turn.');
            }
        }

        $board_size = count($board);
        $data = $request->validate([
            'code' => 'required|int|between:0,20',
            'origin_x' => 'required|int|between:0,'.$board_size - 1,
            'origin_y' => 'required|int|between:0,'.$board_size - 1,
            'rotation' => 'required|int|between:0,3',
            'flip' => 'required|boolean',
        ]);

        if(!$player_available_pieces[(int)$data['code']]) {
            if($request->expectsJson()) {
                return response([
                    'valid' => false,
                    'board' => $board,
                    'message' => 'The piece is not available to you'
                ])->setStatusCode(400);
            } else {
                return inertia('Game')->with('flash', 'The piece is not available to you');
            }
        }


        $pieces_object = $this->getAllPieceParts();

        $piece_code = (string)$data['code'];
        $piece_parts = $pieces_object->$piece_code;
        $piece = $this->getPieceMatrix($piece_parts);
        if($data['flip']) $this->flipPiece($piece);
        for($i = 0; $i < $data['rotation']; $i++) {
            $this->rotatePiece($piece, $data['flip']);
        }

        $origin_offset = $this->identifyOriginOffset($piece);
        $origin_offset['y'] = $data['origin_y'] - $origin_offset['y'];
        $origin_offset['x'] = $data['origin_x'] - $origin_offset['x'];

        $move_validations = $this->validateMove($board, $piece, $origin_offset, $player_color[0]);

        $is_valid = $move_validations['is_valid'] && (
            $current_session['current_round'] < $current_session['player_count'] && $move_validations['is_touching_board_corner'] ||
            $current_session['current_round'] >= $current_session['player_count'] && $move_validations['is_touching_adjacent']);

        $piece_parts_offset = array_map(fn($part) => [
               'x' => $part->x + $origin_offset['x'],
               'y' => $part->y + $origin_offset['y'],
        ], $piece_parts);

        return response(['valid' => $is_valid, 'origin_x' => $data['origin_x'], 'origin_y' => $data['origin_y'], 'block_positions' => $piece_parts_offset]);
    }

    private function getPieceMatrix(array $piece): array {
        $piece_pos = 0;
        $piece_matrix = [];

        for($y = 0; $y < RELATIVE_MATRIX_SIZE; $y++) {
            for($x = 0; $x < RELATIVE_MATRIX_SIZE; $x++) {
                $pieice_to_insert = 0;
                if(
                    $piece_pos < count($piece) &&
                    $piece[$piece_pos]->x === $x &&
                    $piece[$piece_pos]->y === $y
                ) {
                    $pieice_to_insert = $piece_pos > 0 ? 1 : 2;
                    $piece_pos++;
                }

                $piece_matrix[$y][$x] = $pieice_to_insert;
            }
        }

        return $piece_matrix;
    }

    private function flipPiece(array &$piece): void {
        for($y = 0; $y < RELATIVE_MATRIX_SIZE; $y++) {
            for($x = 0; $x < intdiv(RELATIVE_MATRIX_SIZE, 2); $x++) {
                $temp = $piece[$y][$x];
                $piece[$y][$x] = $piece[$y][RELATIVE_MATRIX_SIZE - $x - 1];
                $piece[$y][RELATIVE_MATRIX_SIZE - $x - 1] = $temp;
            }
        }
    }

    private function rotatePiece(array &$piece, bool $clockwise): void {
        $copy = [...$piece];

        for($y = 0; $y < RELATIVE_MATRIX_SIZE; $y++) {
            for($x = 0; $x < RELATIVE_MATRIX_SIZE; $x++) {
                $new_x = $clockwise ? $y : RELATIVE_MATRIX_SIZE - $y - 1;
                $new_y = $clockwise ? RELATIVE_MATRIX_SIZE - $x - 1 : $x;

                $piece[$new_y][$new_x] = $copy[$y][$x];
            }
        }
    }

    private function identifyOriginOffset(array $piece): array {
        $y_offset = 0;
        $x_offset = 0;

        $found = false;

        $y = 0;
        $x = 0;
        while($y < RELATIVE_MATRIX_SIZE && !$found) {
            $x = 0;
            while($x < RELATIVE_MATRIX_SIZE && !$found) {
                if($piece[$y][$x] === 2) {
                    $y_offset = $y;
                    $x_offset = $x;

                    $found = true;
                }

                $x++;
            }

            $y++;
        }

        return [ 'y' => $y_offset, 'x' => $x_offset];
    }

    private function validateMove(array $board, array $piece, array $piece_origin, string $player_color): array {
        // TODO: Please clean this up soon... the code below is sad
        $is_valid = true;
        $is_touching_adjacent = false;
        $is_touching_board_corner = false;
        $board_size = count($board);
        $piece_size = count($piece);

        error_log('Piece matrix size: ' . $piece_size);
        error_log($this->displayFull($piece, []));

        $y = 0;
        $x = 0;
        while($y < $piece_size && $is_valid) {
            $x = 0;
            while($x < $piece_size && $is_valid) {
                if($piece[$y][$x] === 0) {
                    $x++;
                    continue;
                }

                $current_y = $piece_origin['y'] + $y;
                $current_x = $piece_origin['x'] + $x;
                error_log('Current (' . $current_x . ',' . $current_y . ') Piece Origin (' . $piece_origin['y'] . ',' . $piece_origin['x'] . ') Offset (' . $y . ',' . $x . ')'  );

                error_log('Outside of board? (' . $current_x . ',' . $current_y . ') ' . (($current_y < 0 || $current_x < 0 || $current_y >= $board_size || $current_x >= $board_size) ? 'true' : 'false'));
                if($current_y < 0 || $current_x < 0) {
                    $is_valid = false;
                    continue;
                }

                if($current_y >= $board_size || $current_x >= $board_size) {
                    $is_valid = false;
                    continue;
                }

                error_log('Is ' . $board[$current_y][$current_x] . ' Empty? (' . $current_x . ',' . $current_y . ') ' . ($board[$current_y][$current_x] !== GameSession::EMPTY_BOARD_CELL));
                if($board[$current_y][$current_x] !== GameSession::EMPTY_BOARD_CELL) {
                    $is_valid = false;
                    continue;
                }

                if(!$this->isCrossEmpty($board, $player_color, GameSession::EMPTY_BOARD_CELL, $current_x, $current_y)) {
                    $is_valid = false;
                    continue;
                }

                if($this->isTouchingCorner($board, $player_color, GameSession::EMPTY_BOARD_CELL, $current_x, $current_y)) {
                    $is_touching_adjacent = true;
                }

                error_log('No blocks in x section');

                if($current_x === 0 && $current_y === 0) {
                    $is_touching_board_corner = true;
                }

                if($current_x === 0 && $current_y === $board_size - 1) {
                    $is_touching_board_corner = true;
                }

                if($current_x === $board_size - 1 && $current_y === 0) {
                    $is_touching_board_corner = true;
                }

                if($current_x === $board_size - 1 && $current_y === $board_size - 1) {
                    $is_touching_board_corner = true;
                }

                $x++;
            }
            $y++;
        }

        error_log('Is valid: ' . ($is_valid ? 'true' : 'false') . ' Is touching piece: ' . ($is_touching_adjacent ? 'true' : 'false') . " Is touching corner: " . ($is_touching_board_corner ? 'true' : 'false'));

        return ['is_valid' => $is_valid, 'is_touching_board_corner' => $is_touching_board_corner, 'is_touching_adjacent' => $is_touching_adjacent];
    }

    private function update_board(array &$board, array $piece, array $piece_origin, string $player_char) {
        for($y = 0; $y < RELATIVE_MATRIX_SIZE; $y++) {
            for($x = 0; $x < RELATIVE_MATRIX_SIZE; $x++) {
                if($piece[$y][$x] === 0) continue;

                $current_y = $piece_origin['y'] + $y;
                $current_x = $piece_origin['x'] + $x;
                $board[$current_y][$current_x] = $player_char;
            }
        }
    }

    private function addBordersToPieceMatrix(array $piece): array {
        $bordered_piece_matrix = [];
        for($y = 0; $y < RELATIVE_MATRIX_SIZE_WITH_BORDER; $y++) {
            $bordered_piece_matrix_row = [];
            for($x = 0; $x < RELATIVE_MATRIX_SIZE_WITH_BORDER; $x++) {
                $bordered_piece_matrix_row[$x] = 0;

                $piece_y = $y - MATRIX_BORDER_SIZE;
                $piece_x = $x - MATRIX_BORDER_SIZE;
                if($piece_y >= 0 && $piece_x >= 0 && $piece_y < RELATIVE_MATRIX_SIZE && $piece_x < RELATIVE_MATRIX_SIZE) {
                    $bordered_piece_matrix_row[$x] = $piece[$piece_y][$piece_x] === 0 ? 0 : 1;
                }
            }

            $bordered_piece_matrix[$y] = $bordered_piece_matrix_row;
        }

        return $bordered_piece_matrix;
    }

    /**
     * Returns array containing positions [x, y] for every valid corner connection for a matrix.
     * */
    private function getValidCornerConnectionPositions(array $matrix, string|int $colored_cell, string|int $empty_cell): array {
        $positions = [];
        $matrix_size = count($matrix);

        for($y = 0; $y < $matrix_size; $y++) {
            for($x = 0; $x < $matrix_size; $x++) {
                if(
                    $matrix[$y][$x] === $empty_cell &&
                    $this->isCrossEmpty($matrix, $colored_cell, $empty_cell, $x, $y) &&
                    $this->isTouchingCorner($matrix, $colored_cell, $empty_cell, $x, $y)
                ) {
                    array_push($positions, [$x, $y]);
                }
            }
        }

        return $positions;
    }

    /**
     * Returns array containing positions [x, y] for every edge for a piece
     * */
    private function getPieceEdges(array $matrix, string|int $colored_cell, string|int $empty_cell): array {
        $positions = [];
        $matrix_size = count($matrix);

        for($y = 0; $y < $matrix_size; $y++) {
            for($x = 0; $x < $matrix_size; $x++) {
                $is_edge = false;

                // Top Left
                if(
                    $matrix[$y][$x] === $colored_cell &&
                    $matrix[$y][$x - 1] === $empty_cell &&
                    $matrix[$y - 1][$x] === $empty_cell &&
                    $matrix[$y - 1][$x - 1] === $empty_cell
                ) $is_edge = true;


                // Top Right
                if(
                    !$is_edge &&
                    $matrix[$y][$x] === $colored_cell &&
                    $matrix[$y][$x + 1] === $empty_cell &&
                    $matrix[$y - 1][$x] === $empty_cell &&
                    $matrix[$y - 1][$x + 1] === $empty_cell
                ) $is_edge = true;

                // Bottom Left
                if(
                    !$is_edge &&
                    $matrix[$y][$x] === $colored_cell &&
                    $matrix[$y][$x - 1] === $empty_cell &&
                    $matrix[$y + 1][$x] === $empty_cell &&
                    $matrix[$y + 1][$x - 1] === $empty_cell
                ) $is_edge = true;

                // Bottom Right
                if(
                    !$is_edge &&
                    $matrix[$y][$x] === $colored_cell &&
                    $matrix[$y][$x + 1] === $empty_cell &&
                    $matrix[$y + 1][$x] === $empty_cell &&
                    $matrix[$y + 1][$x + 1] === $empty_cell
                ) $is_edge = true;

                if($is_edge) {
                    array_push($positions, [$x, $y]);
                }
            }
        }

        return $positions;
    }

    private function isCrossEmpty(array $matrix, string|int $colored_cell, string|int $empty_cell, int $x, int $y): bool {
        $is_empty = true;
        $matrix_size = count($matrix);

        if(
            $y - 1 >= 0 &&
            $matrix[$y - 1][$x] !== $empty_cell &&
            $matrix[$y - 1][$x] === $colored_cell
        ) $is_empty = false;

        if(
            $is_empty &&
            $y + 1 < $matrix_size &&
            $matrix[$y + 1][$x] !== $empty_cell &&
            $matrix[$y + 1][$x] === $colored_cell
        ) $is_empty = false;

        if(
            $is_empty &&
            $x - 1 >= 0 &&
            $matrix[$y][$x - 1] !== $empty_cell &&
            $matrix[$y][$x - 1] === $colored_cell
        ) $is_empty = false;

        if(
            $is_empty &&
            $x + 1 < $matrix_size &&
            $matrix[$y][$x + 1] !== $empty_cell &&
            $matrix[$y][$x + 1] === $colored_cell
        ) $is_empty = false;

        return $is_empty;
    }

    private function isTouchingCorner(array $matrix, string|int $colored_cell, string|int $empty_cell, int $x, int $y): bool {
        $is_touching = false;
        $matrix_size = count($matrix);

        if(
            !$is_touching &&
            $x - 1 >= 0 && $y - 1 >= 0 &&
            $matrix[$y - 1][$x - 1] !== $empty_cell &&
            $matrix[$y - 1][$x - 1] === $colored_cell
        ) $is_touching = true;

        if(
            !$is_touching &&
            $x + 1 < $matrix_size && $y - 1 >= 0 &&
            $matrix[$y - 1][$x + 1] !== $empty_cell &&
            $matrix[$y - 1][$x + 1] === $colored_cell
        ) $is_touching = true;

        if(
            !$is_touching &&
            $x - 1 >= 0 && $y + 1 < $matrix_size &&
            $matrix[$y + 1][$x - 1] !== $empty_cell &&
            $matrix[$y + 1][$x - 1] === $colored_cell
        ) $is_touching = true;


        if(
            !$is_touching &&
            $x + 1 < $matrix_size && $y + 1 < $matrix_size &&
            $matrix[$y + 1][$x + 1] !== $empty_cell &&
            $matrix[$y + 1][$x + 1] === $colored_cell
        ) $is_touching = true;

        return $is_touching;
    }

    /**
     * EXTREMELY INEFFICIENT CODE THAT CALCULATES THE NEXT VALID MOVES FOR EACH POSITION.
     * For this reason once it identifies a valid move it escapes
     * */
    function hasValidMoves(array $board, string $player_color_char, array $player_available_pieces): bool {
        $pieces_object = $this->getAllPieceParts();

        $board_valid_connections = $this->getValidCornerConnectionPositions($board, $player_color_char, '');

        foreach($player_available_pieces as $piece_code => $available) {
            if(!$available) continue;

            $piece_parts = $pieces_object->$piece_code;
            $piece = $this->getPieceMatrix($piece_parts);
            for($flip = 0; $flip < 1; $flip++) {
                if($flip === 1) $this->flipPiece($piece);

                for($i = 0; $i < 4; $i++) {
                    $bordered_piece = $this->addBordersToPieceMatrix($piece);
                    $piece_valid_connections = $this->getPieceEdges($bordered_piece, 1, 0);

                    foreach($board_valid_connections as $board_origin) {
                        foreach($piece_valid_connections as $piece_origin) {
                            $origin_offset = [
                                'y' => $board_origin[1] - $piece_origin[1],
                                'x' => $board_origin[0] - $piece_origin[0],
                            ];

                            error_log('Board (' . $board_origin[0] . ', ' . $board_origin[1] . ') Piece (' . $piece_origin[0] . ', ' . $piece_origin[1] . ')');
                            $move_validations = $this->validateMove($board, $bordered_piece, $origin_offset, $player_color_char);

                            if($move_validations['is_touching_adjacent'] && $move_validations['is_valid']) {
                                return true;
                            }
                        }
                    }

                    $this->rotatePiece($piece, $flip === 1);
                }
            }
        }

        return false;
    }

    private function calculateAddedScore(string $piece_code, array $piece_parts, bool $has_finished, array $available_pieces): int {
        $score = 0;

        $score += count($piece_parts);

        if($has_finished) {
            $count_available_pieces = array_reduce($available_pieces, function($acc, $available) {
                $acc += $available ? 1 : 0;
                return $acc;
            }, 0);

            $score += $count_available_pieces === 0 ? SCORE_PLACE_ALL_PIECES : 0;
        }

        if($has_finished && $piece_code === '0') {
            $score += SCORE_LAST_PIECE_MONONIMINO;
        }

        return $score;
    }

    private function getAllPieceParts(): object {
        // WARN: Very Inefficient code... does it matter though?
        $pieces_json = file_get_contents('pieces.json');
        return json_decode($pieces_json);
    }

    private function display3x3(array $matrix, array $ascii_mapping, string $header_details, int $x, int $y) {
        $matrix_size = count($matrix);
        $display_string = $x.','.$y.' ('.$matrix[$y][$x].') '.$header_details."\n";

        for($block_y = -1; $block_y < 2; $block_y++) {
            $curr_y = $y + $block_y;
            for($block_x = -1; $block_x < 2; $block_x++) {
                $curr_x = $x + $block_x;
                $ascii = '.';

                if($curr_y >= 0 && $curr_y < $matrix_size && $curr_x >= 0 && $curr_x < $matrix_size) {
                    $ascii = $ascii_mapping[$matrix[$curr_y][$curr_x]] ?? $matrix[$curr_y][$curr_x];
                }

                $display_string .= $ascii . ' ';
            }

            $display_string .= "\n";
        }

        return $display_string;
    }

    private function displayFull(array $matrix, array $ascii_mapping) {
        $board_string = '';
        $grid_size = count($matrix);
        for($y = 0; $y < $grid_size; $y++) {
            for($x = 0; $x < $grid_size; $x++) {
                $piece_ascii = $ascii_mapping[$matrix[$y][$x]] ?? $matrix[$y][$x];
                $board_string .= $piece_ascii . ' ';
            }
            $board_string .= "\n";
        }

        return $board_string;
    }

}

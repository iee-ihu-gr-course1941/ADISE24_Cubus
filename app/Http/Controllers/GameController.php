<?php

namespace App\Http\Controllers;

use App\Enums\GameSessionState;
use App\Models\GameSession;
use Illuminate\Http\Request;
use function GuzzleHttp\json_encode;

const RELATIVE_MATRIX_SIZE = 5;

class GameController extends Controller {
    function index(Request $request): \Inertia\Response | \Inertia\ResponseFactory | \Illuminate\Http\Response {
        $player = AuthService::getUser();
        $current_session = $player->getCurrentSession();

        $visualize_game = $request->hasHeader('GAME');

        if($request->expectsJson() && $visualize_game) {
            return response(
                $current_session->visualizeGameHeader() .
                "\n" .
                $current_session->visualizeBoard()
            );
        }

        if($request->expectsJson()) {
            return response($current_session->getPublic());
        }

        return inertia('Game');
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

        $piece = $this->getPieceMatrix((string)$data['code']);
        if($data['flip']) $this->flipPiece($piece);
        for($i = 0; $i < $data['rotation']; $i++) {
            $this->rotatePiece($piece, $data['flip']);
        }

        $origin_offset = $this->identifyOriginOffset($piece);
        $origin_offset['y'] = $data['origin_y'] - $origin_offset['y'];
        $origin_offset['x'] = $data['origin_x'] - $origin_offset['x'];

        $is_valid = $this->is_valid(
            $board, $piece,
            $origin_offset, $current_session['current_round'],
            $player_color[0], $current_session['player_count']
        );
        if($is_valid) {
            $this->update_board($board, $piece, $origin_offset, $player_color[0]);
            $player_available_pieces[(int)$data['code']] = false;
            $current_session['player_'.$player_color.'_inventory'] = $player_available_pieces;
            $current_session['board_state'] = json_encode($board);
            $current_session['current_round'] = $current_session['current_round'] + 1;
            $current_session['current_playing'] = $current_session->getNextPlayerColor();
            $current_session->save();
        }

        if($request->expectsJson()) {
            return response(['valid' => $is_valid, 'board' => $board]);
        }

        return inertia('Game');
    }

    private function getPieceMatrix(string $code): array {
        // WARN: Very Inefficient code... does it matter though?
        $pieces_json = file_get_contents('pieces.json');
        $pieces_object = json_decode($pieces_json);
        $piece = $pieces_object->$code;

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

    private function is_valid(array $board, array $piece, array $piece_origin, int $move_count, string $player_color, int $player_count): bool {
        // TODO: Please clean this up soon... the code below is sad
        $is_valid = true;
        $is_touching_adjacent = false;
        $is_touching_board_corner = false;
        $board_size = count($board);

        $y = 0;
        $x = 0;
        while($y < RELATIVE_MATRIX_SIZE && $is_valid) {
            $x = 0;
            while($x < RELATIVE_MATRIX_SIZE && $is_valid) {
                if($piece[$y][$x] === 0) {
                    $x++;
                    continue;
                }

                $current_y = $piece_origin['y'] + $y;
                $current_x = $piece_origin['x'] + $x;

                if($current_y < 0 || $current_x < 0) {
                    $is_valid = false;
                    continue;
                }

                if($current_y >= $board_size || $current_x >= $board_size) {
                    $is_valid = false;
                    continue;
                }

                /*error_log(*/
                /*    '(Verifying x) (x:'.$current_x.';y:'.$current_y.')'."\n".*/
                /*    $board[$current_y - 1][$current_x - 1].$board[$current_y - 1][$current_x].$board[$current_y - 1][$current_x + 1]."\n".*/
                /*    $board[$current_y][$current_x - 1].$board[$current_y][$current_x].$board[$current_y][$current_x + 1]."\n".*/
                /*    $board[$current_y + 1][$current_x - 1].$board[$current_y + 1][$current_x].$board[$current_y + 1][$current_x + 1]*/
                /*);*/

                if($board[$current_y][$current_x] !== GameSession::EMPTY_BOARD_CELL) {
                    $is_valid = false;
                    continue;
                }

                error_log('Not on top of another block');

                // Empty Cross Check
                if(
                    $current_y - 1 > 0 &&
                    $board[$current_y - 1][$current_x] !== GameSession::EMPTY_BOARD_CELL &&
                    $board[$current_y - 1][$current_x] === $player_color
                ) {
                    $is_valid = false;
                    continue;
                }

                if(
                    $current_y + 1 < $board_size &&
                    $board[$current_y + 1][$current_x] !== GameSession::EMPTY_BOARD_CELL &&
                    $board[$current_y + 1][$current_x] === $player_color
                ) {
                    $is_valid = false;
                    continue;
                }

                if(
                    $current_x - 1 > 0 &&
                    $board[$current_y][$current_x - 1] !== GameSession::EMPTY_BOARD_CELL &&
                    $board[$current_y][$current_x - 1] === $player_color
                ) {
                    $is_valid = false;
                    continue;
                }

                if(
                    $current_x + 1 < $board_size &&
                    $board[$current_y][$current_x + 1] !== GameSession::EMPTY_BOARD_CELL &&
                    $board[$current_y][$current_x + 1] === $player_color
                ) {
                    $is_valid = false;
                    continue;
                }

                error_log('No blocks in cross section');

                // Filled X Check
                if(
                    $current_x - 1 > 0 && $current_y - 1 > 0 &&
                    $board[$current_y - 1][$current_x - 1] !== GameSession::EMPTY_BOARD_CELL &&
                    $board[$current_y - 1][$current_x - 1] === $player_color
                ) {
                    $is_touching_adjacent = true;
                }

                if(
                    $current_x + 1 < $board_size && $current_y - 1 > 0 &&
                    $board[$current_y - 1][$current_x + 1] !== GameSession::EMPTY_BOARD_CELL &&
                    $board[$current_y - 1][$current_x + 1] === $player_color
                ) {
                    $is_touching_adjacent = true;
                }

                if(
                    $current_x - 1 > 0 && $current_y + 1 < $board_size &&
                    $board[$current_y + 1][$current_x - 1] !== GameSession::EMPTY_BOARD_CELL &&
                    $board[$current_y + 1][$current_x - 1] === $player_color
                ) {
                    $is_touching_adjacent = true;
                }

                if(
                    $current_x + 1 < $board_size && $current_y + 1 < $board_size &&
                    $board[$current_y + 1][$current_x + 1] !== GameSession::EMPTY_BOARD_CELL &&
                    $board[$current_y + 1][$current_x + 1] === $player_color
                ) {
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

        error_log('Is touching piece: ' . $is_touching_adjacent . "\n Is touching corner: " . $is_touching_board_corner);

        return $is_valid && ($move_count < $player_count && $is_touching_board_corner || $move_count >= $player_count && $is_touching_adjacent);
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
}

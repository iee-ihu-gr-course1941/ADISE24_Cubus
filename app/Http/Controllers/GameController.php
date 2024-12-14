<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
        $data = $request->validate([
            'code' => 'required|string',
            'origin' => 'required|string',
            'rotation' => 'required|int',
            'flip' => 'required|boolean',
        ]);

        $piece = $this->getPieceMatrix($data['code']);
        if($data['flip']) $this->flipPiece($piece);

        if($request->expectsJson()) {
            return response($piece);
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
}

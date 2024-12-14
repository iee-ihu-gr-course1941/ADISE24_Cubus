<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
}

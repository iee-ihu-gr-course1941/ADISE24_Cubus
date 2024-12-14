<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GameController extends Controller {
    function index(Request $request): \Inertia\Response | \Inertia\ResponseFactory {
        if($request->expectsJson()) {
            return response('API Representation currently not supported');
        }

        return inertia('Game');
    }
}

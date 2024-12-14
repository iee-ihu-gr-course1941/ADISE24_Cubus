<?php

namespace App\Http\Middleware;

use App\Http\Controllers\AuthService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ManageInGameVerification {
    /**
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response {
        $user = AuthService::getUser();
        $game_session = $user->getCurrentSession();
        $user_game_color = $user->getCurrentSessionColor();

        // TODO: Do we allow only if a game has started?


        if(is_null($game_session) || is_null($user_game_color)) {
            return redirect()->route('index');
        }

        return $next($request);
    }

}

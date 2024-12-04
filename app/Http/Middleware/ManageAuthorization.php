<?php

namespace App\Http\Middleware;

use App\Http\Controllers\AuthService;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ManageAuthorization {
    /**
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response {
        $private_id = $request->cookies->get('private_id');

        if(is_null(AuthService::getUser())) {
            return redirect()->route('index');
        }

        if(is_null($private_id) || is_null($this->collectUserByPrivateID($private_id))) {
            AuthService::logout($request);
            return redirect()->route('index')->with('flash', 'You are not logged in.');
        }

        if($request->expectsJson() && is_null(AuthService::getUser())) {
            return response([
                'message' => 'You are not authenticated for this action.'
            ])->withHeaders(['Content-Type' => 'application/json'])
                ->setStatusCode(401);
        }

        return $next($request);
    }

    function collectUserByPrivateID(string $private_id): ?User {
        $user_request = User::where('private_id', $private_id)->get();
        if(count($user_request) === 0) return null;

        return $user_request[0];
    }
}

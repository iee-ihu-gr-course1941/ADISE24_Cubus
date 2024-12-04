<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserTokenExistence {
    /**
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response {
        if(is_null($request->cookie('user-token'))) {
            Cookie::queue(cookie('user-token', Str::uuid(), secure: true, httpOnly: false, minutes: 100000000, path: '/'));
        }

        return $next($request);
    }
}

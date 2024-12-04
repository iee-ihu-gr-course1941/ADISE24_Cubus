<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\EnsureUserTokenExistence::class,
            \App\Http\Middleware\ManageAuthorization::class,
        ]);

        $middleware->api(append: [
            Illuminate\Cookie\Middleware\EncryptCookies::class
        ]);

        $middleware->encryptCookies(except: [ 'user-token' ]);

        $middleware->priority([
            \App\Http\Middleware\EnsureUserTokenExistence::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

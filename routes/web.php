<?php

use App\Http\Controllers\AuthService;
use App\Http\Controllers\GameController;
use App\Http\Controllers\GameSessionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::withoutMiddleware(['auth', \App\Http\Middleware\ManageAuthorization::class])->group(function () {
    Route::get('/', function () {
        $user = AuthService::getUser();
        $user = !is_null($user) ? $user->getPublic() : null;

        if(request()->expectsJson()) {
            $message = 'Welcome, please login to start using the game API';
            if(!is_null($user)) $message = 'Hello ' . $user['name'] . '!';
            return [ 'message' => $message ];
        }

        return inertia('Index', [ 'user' => $user ]);
    })->name('index');

    Route::get('/apps-login-callback', [UserController::class, 'loginApps'])->name('login.apps');
    Route::get('/mock-login/{id}', [UserController::class, 'loginMock'])->name('login.mock');
});

Route::get('/profile/logout', [UserController::class, 'logout'])->name('logout');
Route::resource('profile', UserController::class)->only(['show', 'create', 'edit', 'store']);
Route::resource('lobby',   GameSessionController::class)->only(['index', 'create', 'store']);

Route::get('/lobby/current', [GameSessionController::class, 'show']);
Route::get('/lobby/match',  [GameSessionController::class, 'search'])->name('lobby.match');
Route::get('/lobby/{game_session}/join', [GameSessionController::class, 'join'])->name('lobby.join');
Route::get('/lobby/disconnect', [GameSessionController::class, 'disconnect'])->name('lobby.disconnect');

Route::middleware(\App\Http\Middleware\ManageInGameVerification::class)->group(function () {
    Route::resource('/game', GameController::class)->only(['index']);
    Route::post('/game/move', [GameController::class, 'move'])->name('game.move');
});

Route::get('/card-demo', function () {
    return inertia('CardDemo');
})->name('card-demo');

Route::get('/test/csrf', function (Request $request) {
    return $request->cookies->get('XSRF-TOKEN');
});

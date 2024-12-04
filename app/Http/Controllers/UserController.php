<?php

namespace App\Http\Controllers;

use App\Events\LoginEvent;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class UserController extends Controller {
    public function loginApps(Request $request): \Illuminate\Http\Response {
        $user_token = $request->cookie('user-token');
        $user_code = $request->query->get('code');
        $redirect_url = $request->query->get('state') ?? route('index');
        if(is_null($user_code)) return 'funk';

        $user = null;
        try {
            $user = AuthService::loginApps($request, $user_code);
        } catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ])->setStatusCode(400);
        }

        if($user['is_new']) {
                $redirect_url = route('profile.create');
        }

        broadcast(new LoginEvent(true, $redirect_url, $user_token));

        Cookie::queue(cookie('private_id', $user['private_id'], minutes: 100000000, path: '/'));

        if($request->expectsJson()) {
            return response($user->getPublic())->withHeaders(['Content-Type' => 'application/json']);
        }

        return response('Logged in successfully! go back to the previous tab to continue...');
    }

    public function loginMock(Request $request, string $id): \Illuminate\Http\Response | \Illuminate\Http\RedirectResponse {
        try {
            $user = AuthService::loginMock($request, $id);
        } catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ])->setStatusCode(400);
        }

        Cookie::queue(cookie('private_id', $user['private_id'], minutes: 100000000, path: '/'));

        if($request->expectsJson()) {
            return response($user->getPublic())->withHeaders(['Content-Type' => 'application/json']);
        }

        return redirect()->route('index');
    }

    public function show(): \Illuminate\Http\Response {
        $user = AuthService::getUser();
        return response(!is_null($user) ? $user->getPublic() : ['message' => 'No user could be found'])->withHeaders(['Content-Type' => 'application/json']);
    }

    public function logout(Request $request): \Illuminate\Http\Response | \Illuminate\Http\RedirectResponse {
        AuthService::logout($request);
        Cookie::expire('private_id');

        if($request->expectsJson()) {
            return response([
                'message' => 'Disconnected successfully'
            ])->withHeaders(['Content-Type' => 'application/json']);
        }
        return redirect()->route('index')->with('flash', 'Logged out successfully.');
    }

    public function create(Request $request): \Inertia\ResponseFactory | \Inertia\Response | \Illuminate\Http\Response {
        $user = AuthService::getUser();
        $user = !is_null($user) ? $user->getPublic() : null;

        if($request->expectsJson()) {
            return response([
                'message' => 'To update the user details do: POST '.route('profile.store')
            ])->withHeaders(['Content-Type' => 'application/json']);
        }

        return inertia('Edit', [ 'user' => $user, 'isNew' => true ]);
    }

    public function edit(Request $request): \Inertia\ResponseFactory | \Inertia\Response | \Illuminate\Http\Response {
        $user = AuthService::getUser();
        $user = !is_null($user) ? $user->getPublic() : null;

        if($request->expectsJson()) {
            return response([
                'message' => 'To update the user details do: POST '.route('profile.store')
            ])->withHeaders(['Content-Type' => 'application/json']);
        }


        return inertia('Edit', [ 'user' => $user, 'isNew' => false ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse | \Illuminate\Http\Response {
        $user = AuthService::getUser();

        $data = $request->validate([
            'name' => 'required|string|max:80|regex:/^[a-zA-Z-0-9_\-.!#$%^&*]*$/',
            'icon' => 'required|url:http,https',
        ]);

        $user['name'] = $data['name'];
        $user['icon'] = $data['icon'];
        $user->save();

        if($request->expectsJson()) {
            return response($user->getPublic())->withHeaders(['Content-Type' => 'application/json']);
        }

        return redirect()->route('profile.edit', ['profile' => $user['name']]);
    }
}

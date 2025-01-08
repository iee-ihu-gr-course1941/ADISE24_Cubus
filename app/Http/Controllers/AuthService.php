<?php

namespace App\Http\Controllers;

use App\Enums\AuthenticationType;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AuthService {
    public static function getUser(): ?User {
        $user = Auth::user();
        return $user;
    }

    public static function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    /**
     * @throws Exception
     */
    public static function loginApps(Request $request, string $user_code): ?User {
        $access_token = AuthService::getAppsAccessToken($user_code);
        $user_info = AuthService::getAppsUserInformation($access_token);

        $user = AuthService::collectExistingOrCreateNewUser($user_info);

        Auth::login($user);
        $request->session()->regenerate();
        return $user;
    }

    public static function loginMock(Request $request, string $user_id): ?User {
        $user = AuthService::collectExistingOrCreateNewUser(new User([
            'auth_type' => 'mock',
            'auth_identifier' => $user_id,
            'name' => 'mock_user',
        ]));

        Auth::login($user);
        $request->session()->regenerate();
        return $user;
    }

    /**
     * @throws Exception
     */
    private static function getAppsAccessToken(string $user_code): string {
        $token_response = Http::asForm()
            ->withoutVerifying()
            ->post('https://login.iee.ihu.gr/token', [
                'client_id' => '672528da2b7dd621991df736',
                'client_secret' => '3h6rg6wm4y6wr5pdv8to766osiyt8ynz194tznkmtg90w0ks0j',
                'grant_type' => 'authorization_code',
                'code' => $user_code,
            ]);

        $token_body = $token_response->json();

        if($token_response->failed() || is_null($token_body) || !array_key_exists('access_token', $token_body)) {
            throw new Exception($token_body['error']['message'] ?? 'Failed to retireve access token.');
        }

        return $token_body['access_token'];
    }

    /**
     * @throws Exception
     */
    private static function getAppsUserInformation(string $access_token): User  {
        $profile_response = Http::withoutVerifying()
            ->acceptJson()
            ->withHeader('x-access-token', $access_token)
            ->get('https://api.iee.ihu.gr/profile');

        $profile_body = $profile_response->json();

        if($profile_response->failed() || is_null($profile_body) || !array_key_exists('cn', $profile_body) || !array_key_exists('id', $profile_body)) {
            throw new Exception($profile_body['error']['message']);
        }

        return new User([
            'auth_type' => AuthenticationType::Apps->value,
            'auth_identifier' => $profile_body['id'],
            'name' => str_replace(' ', '_', $profile_body['cn']),
        ]);
    }

    /*
     * Guaranteed that the returned user will have a private_id
     */
    private static function collectExistingOrCreateNewUser(User $user_info): User {
        if(is_null($user_info['auth_type']) || is_null($user_info['auth_identifier'])) {
            throw new Exception('Failed to provide auth_type or auth_identifier.');
        }

        if(array_search($user_info['auth_type'], AuthenticationType::values()) === false) {
            throw new Exception('The authentication type "'.$user_info['auth_type'].'" is not managed by the system.');
        }

        $users = User::where('auth_type', $user_info['auth_type'])->where('auth_identifier', $user_info['auth_identifier'])->get();
        if(!$users->isEmpty()) {
            $users[0]['is_new'] = false;
            return $users[0];
        }

        $user_info['private_id'] = Str::uuid();
        $user_info['public_id']  = Str::uuid();
        $user_info->save();
        $user_info['is_new'] = true;

        return $user_info;
    }
}

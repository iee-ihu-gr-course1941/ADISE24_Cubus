<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('game.{id}', function (User $user, int $id) {
    $user_current_session_id = $user->getCurrentSession()['id'];

    error_log('Attempting to connect user in ' . $id . ' that\'s in session ' . $user_current_session_id);

    if($user_current_session_id !== $id) return false;
    error_log('Connected user ' . $user['name'] . '(' . $user['id'] . ') successfully');
    return true;
});

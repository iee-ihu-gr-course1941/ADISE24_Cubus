<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('game.{id}', function (User $user, string $id) {
    error_log('WTF:::: ' . $id);
    return true;
});

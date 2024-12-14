<?php

namespace App\Models;

use App\Enums\PlayerColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable {
    use HasFactory;

    protected $fillable = [
        'name', 'icon', 'auth_identifier', 'auth_type'
    ];

    protected $public = [
        'name',
        'icon',
        'public_id',
    ];

    function getPublic() {
        $public_instance = [];

        foreach($this->public as $col) {
            $public_instance[$col] = $this[$col];
        }

        return $public_instance;
    }

    function getCurrentSession(): ?GameSession {
        $currentUserSessions = GameSession::query();
        $nextQuery = 'where';
        foreach(PlayerColor::values() as $color) {
            $currentUserSessions = $currentUserSessions->$nextQuery('player_'.$color.'_id', '=', $this['id']);
            $nextQuery = 'orWhere';
        }
        $currentUserSessions = $currentUserSessions->get();

        if(count($currentUserSessions) == 0) return null;

        return $currentUserSessions[0];
    }

    function getCurrentSessionColor(): ?PlayerColor {
        $current_session = $this->getCurrentSession();
        if(is_null($current_session)) return null;

        foreach(PlayerColor::values() as $color) {
            if($current_session['player_'.$color.'_id'] == $this['id']) return PlayerColor::from($color);
        }

        return null;
    }
}

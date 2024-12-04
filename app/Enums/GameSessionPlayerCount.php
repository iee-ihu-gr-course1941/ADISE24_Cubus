<?php

namespace App\Enums;

enum GameSessionPlayerCount: int {
    case Four = 4;
    case Two  = 2;

    static function values(): array {
        return array_column(GameSessionPlayerCount::cases(), 'value');
    }
}

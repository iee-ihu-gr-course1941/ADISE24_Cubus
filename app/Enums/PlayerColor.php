<?php

namespace App\Enums;

enum PlayerColor: string {
    case Blue   = 'blue';
    case Yellow = 'yellow';
    case Red    = 'red';
    case Green  = 'green';

    static function values(): array {
        return array_column(PlayerColor::cases(), 'value');
    }
}

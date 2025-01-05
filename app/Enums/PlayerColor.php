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

    static function colorFromChar(string $char) {
        $colors = PlayerColor::values();
        for($i = 0; $i < count($colors); $i++) {
            if($colors[$i][0] === $char) return $colors[$i];
        }

        return '';
    }
}

<?php

namespace App\Enums;

enum GameSessionState: string {
    // The session is ready but not both players have been connected in it yet.
    case Waiting = 'waiting';

    // The game is running
    case Playing = 'playing';

    // Either player disconnected from the session
    case Paused = 'paused';

    // The game finished
    case Complete = 'complete';

    static function values(): array {
        return array_column(GameSessionState::cases(), 'value');
    }
}

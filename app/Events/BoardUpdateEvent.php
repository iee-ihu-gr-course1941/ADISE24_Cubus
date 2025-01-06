<?php

namespace App\Events;

use App\Models\GameSession;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BoardUpdateEvent implements ShouldBroadcastNow {
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        protected GameSession $game_session,
        public string $player_id,
        public string $player_color,
        public int $origin_x,
        public int $origin_y,
        public string $piece_code,
        public array $block_positions,
    ) {}

    /**
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array {
        return [
            new PrivateChannel('game.' . $this->game_session['id']),
        ];
    }

    public function broadcastWith(): array {
        return [
            'session' => $this->game_session->getPublic(),
            'move' => [
                'player_id' => $this->player_id,
                'player_color' => $this->player_color,
                'origin_x' => $this->origin_x,
                'origin_y' => $this->origin_y,
                'piece_code' => $this->piece_code,
                'block_positions' => $this->block_positions,
            ],
        ];
    }
}

<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LoginEvent implements ShouldBroadcast {
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public bool $success,
        public string $redirect_url,
        protected string $user_token,
    ) {}

    public function broadcastOn(): Channel {
        return new Channel('session.'.$this->user_token);
    }
}

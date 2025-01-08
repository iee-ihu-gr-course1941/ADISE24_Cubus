<?php

use App\Enums\GameSessionPlayerCount;
use App\Enums\GameSessionState;
use App\Enums\PlayerColor;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('game_sessions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            // General Session Info
            $table->string('name', length: 80);
            $table->unsignedInteger('current_round')->default(0);
            $table->enum('current_playing', PlayerColor::values())->default(PlayerColor::Blue);
            $table->enum('session_state', GameSessionState::values())->default(GameSessionState::Waiting);
            $table->unsignedInteger('current_player_count')->default(0);
            $table->enum('player_count', GameSessionPlayerCount::values())->default(GameSessionPlayerCount::Four);
            $table->json('board_state');

            // Player Specific Info
            foreach(PlayerColor::values() as $player_color) {
                $table->foreignId('player_'.$player_color.'_id')->nullable()->constrained('users');
                $table->json('player_'.$player_color.'_inventory')->nullable();
                $table->boolean('player_'.$player_color.'_has_finished')->default(false);
                $table->integer('player_'.$player_color.'_points')->default(0);
            }
        });
    }

    public function down(): void {
        Schema::dropIfExists('game_sessions');
    }
};

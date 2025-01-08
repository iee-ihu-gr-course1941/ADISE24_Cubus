<?php

namespace App\Models;

use App\Enums\PlayerColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameSession extends Model {
    use HasFactory;

    const EMPTY_BOARD_CELL = '';

    protected $public = [
        'id', 'name', 'current_round', 'session_state', 'current_playing', 'current_player_count', 'board_state', 'player_count',
        'player_host_id', 'player_host', 'player_blue', 'player_red', 'player_green', 'player_yellow',
        'player_blue_has_finished', 'player_red_has_finished', 'player_green_has_finished', 'player_yellow_has_finished',
        'player_blue_points', 'player_red_points', 'player_green_points', 'player_yellow_points',
    ];

    function getPublic() {
        $public_data = [];
        $session_data = $this->getAll()[0];

        foreach($this->public as $col) {
            if($col === 'board_state') {
                $public_data[$col] = $this->convertBoardToVectors();
                continue;
            }

            if($col === 'player_host' || $col === 'player_blue' || $col === 'player_red' || $col === 'player_green' || $col === 'player_yellow') {
                $public_data[$col] = $session_data[$col]?->getPublic();
                continue;
            }

            $public_data[$col] = $this[$col];
        }

        return $public_data;
    }

    function getAll() {
        return $this->with('player_host')->with('player_green')->with('player_blue')->with('player_red')->with('player_yellow')->get();
    }

    public function player_host() {
        return $this->hasOne(User::class, 'id', 'player_host_id');
    }

    public function player_blue() {
        return $this->hasOne(User::class, 'id', 'player_blue_id');
    }

    public function player_red() {
        return $this->hasOne(User::class, 'id', 'player_red_id');
    }

    public function player_green() {
        return $this->hasOne(User::class, 'id', 'player_green_id');
    }

    public function player_yellow() {
        return $this->hasOne(User::class, 'id', 'player_yellow_id');
    }

    function getPlayingPlayerColors(): array {
        $playing_colors = [];
        $valid_colors = $this->getValidPlayerColors();
        for($i = 0; $i < count($valid_colors); $i++) {
            if($this['player_'.$valid_colors[$i].'_has_finished']) continue;
            array_push($playing_colors, $valid_colors[$i]);
        }

        return $playing_colors;
    }

    function getValidPlayerColors(): array {
        $all_colors = PlayerColor::values();
        $valid_colors = [];
        for($i = 0; $i < count($all_colors); $i++) {
            if($this['player_count'] == 2 && $i % 2 != 0) continue;
            array_push($valid_colors, $all_colors[$i]);
        }

        return $valid_colors;
    }

    function getEmptyPlayerColors(): array {
        $remaining_empty_colors = [];
        $valid_colors = $this->getValidPlayerColors();

        for($i = 0; $i < count($valid_colors); $i++) {
            if(!is_null($this['player_'.$valid_colors[$i].'_id'])) continue;
            array_push($remaining_empty_colors, $valid_colors[$i]);
        }

        return $remaining_empty_colors;
    }

    function getNextPlayerColor(): string {
        $colors = $this->getValidPlayerColors();
        $current_color_index = (int)array_search($this['current_playing'], $colors);

        $next_color_index = ($current_color_index + 1) % count($colors);

        return $colors[$next_color_index];
    }

    function getNextPlayingColor(): string {
        $colors = $this->getPlayingPlayerColors();
        if(count($colors) === 0) return 'blue';

        $current_color_index = (int)array_search($this['current_playing'], $colors);

        $next_color_index = ($current_color_index + 1) % count($colors);

        return $colors[$next_color_index];

    }

    /**
     * @return array<int, array<int, int>>
     * */
    static function generateBoard(int $player_count): array {
        $board = [];

        $grid_size = 0;
        switch($player_count) {
            case 2:
                $grid_size = 14;
                break;
            case 4:
                $grid_size = 20;
                break;
        }

        for($y = 0; $y < $grid_size; $y++) {
            $row = [];
            for($x = 0; $x < $grid_size; $x++) {
                $row[$x] = GameSession::EMPTY_BOARD_CELL;
            }

            $board[$y] = $row;
        }

        return $board;
    }


    function visualizeBoard(): string {
        $board_array = json_decode($this['board_state']);
        $board_string = '';

        $grid_size = count($board_array);

        for($y = 0; $y < $grid_size; $y++) {
            for($x = 0; $x < $grid_size; $x++) {
                $board_string .= $this->cellStateToAscii($board_array[$y][$x]);
                if($x !== $grid_size - 1) $board_string .= ' ';
            }

            $board_string .= "\n";
        }

        return $board_string;
    }

    function cellStateToAscii(string $cell): string {
        if($cell === GameSession::EMPTY_BOARD_CELL) {
            return '_';
        }

        return $cell;
    }

    function convertBoardToVectors(): array {
        $piece_vectors = [];
        $board = json_decode($this['board_state']);

        for($y = 0; $y < count($board); $y++) {
            for($x = 0; $x < count($board); $x++) {
                if($board[$y][$x] === '') continue;

                array_push($piece_vectors, [
                    'x' => $x,
                    'y' => $y,
                    'data' => PlayerColor::colorFromChar($board[$y][$x]),
                ]);
            }
        }

        return $piece_vectors;
    }

    function visualizeGameHeader(): string {
        $header_string = '';
        $data_string   = '';

        $header_string .= '| ';
        $data_string .= '| ';

        $this->addToAsciiBanner('Currently Playing', $this['current_playing'] ?? 'no one', $header_string, $data_string);
        $this->addToAsciiBanner('Round', (string)$this['current_round'], $header_string, $data_string);
        $this->addToAsciiBanner('Status', $this['session_state'], $header_string, $data_string);

        $border = str_repeat('-', strlen($header_string) - 2);

        return
            $border . "\n" .
            $header_string . "\n" .
            $data_string . "\n" .
            $border;
    }

    function visualizeGameFooter(User $player): string {
        $footer_string = '';
        $data_string   = '';

        $footer_string .= '| ';
        $data_string .= '| ';

        $player_color = $player->getCurrentSessionColor();

        $this->addToAsciiBanner('Your Color', $player_color->name, $footer_string, $data_string);
        $this->addToAsciiBanner('Score', $this['player_'.$player_color->value.'_points'], $footer_string, $data_string);

        $border = str_repeat('-', strlen($footer_string) - 2);

        return
            $border . "\n" .
            $footer_string . "\n" .
            $data_string . "\n" .
            $border;
    }

    function addToAsciiBanner(string $key, string $value, string &$header_string, string &$data_string): void {
        $key_length  = strlen($key);
        $data_length = strlen($value);
        $max_length  = max($key_length, $data_length);

        $remaining_key_space = $max_length - $key_length;
        $remaining_data_space = $max_length - $data_length;

        $header_string .= $key . str_repeat(' ', $remaining_key_space) . ' | ';
        $data_string   .= $value . str_repeat(' ' , $remaining_data_space) . ' | ';
    }
}

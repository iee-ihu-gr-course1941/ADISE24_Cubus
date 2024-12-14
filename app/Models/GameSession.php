<?php

namespace App\Models;

use App\Enums\PlayerColor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameSession extends Model {
    use HasFactory;

    protected $public = [
        'id', 'current_round', 'session_state', 'current_playing', 'board_state',
        'player_blue', 'player_red', 'player_green', 'player_yellow',
    ];

    function getPublic() {
        $public_data = [];
        $session_data = $this->getAll()[0];

        foreach($this->public as $col) {
            if(str_starts_with($col, 'player')) {
                $public_data[$col] = $session_data[$col]?->getPublic();
                continue;
            }

            $public_data[$col] = $this[$col];
        }

        return $public_data;
    }

    function getAll() {
        return $this->with('player_green')->with('player_blue')->with('player_red')->with('player_yellow')->get();
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
                $grid_size = 21;
                break;
        }

        for($y = 0; $y < $grid_size; $y++) {
            $row = [];
            for($x = 0; $x < $grid_size; $x++) {
                $row[$x] = -1;
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

    function cellStateToAscii(int $cell): string {
        if($cell === -1) {
            return '_';
        }

        return PlayerColor::colorFromInt($cell);
    }

    function visualizeGameHeader(): string {
        $header_string = '';
        $data_string   = '';

        $header_string .= '| ';
        $data_string .= '| ';

        $this->addtoAsciiHeader('Currently Playing', $this['curent_playing'] ?? 'no one', $header_string, $data_string);
        $this->addtoAsciiHeader('Round', (string)$this['current_round'], $header_string, $data_string);
        $this->addtoAsciiHeader('Status', $this['session_state'], $header_string, $data_string);

        $border = str_repeat('-', strlen($header_string) - 2);

        return
            $border . "\n" .
            $header_string . "\n" .
            $data_string . "\n" .
            $border;
    }

    function addtoAsciiHeader(string $key, string $value, string &$header_string, string &$data_string): void {
        $key_length  = strlen($key);
        $data_length = strlen($value);
        $max_length  = max($key_length, $data_length);

        $remaining_key_space = $max_length - $key_length;
        $remaining_data_space = $max_length - $data_length;

        $header_string .= $key . str_repeat(' ', $remaining_key_space) . ' | ';
        $data_string   .= $value . str_repeat(' ' , $remaining_data_space) . ' | ';
    }
}

import { PlayerColor, SessionState, ValorizedVector2 } from '@/types/game';
import {Id, Timestamp} from '../index';
import { User } from './User';

export type GameState = {
    id: Id;
    timestamps: Timestamp;
    current_round: number; //* [Default value]: 0
    board_state?: Array<ValorizedVector2>;
    session_state?: SessionState;

    player_count?: 2 | 4;

    player_blue?: User;
    player_blue_has_finished?: boolean;
    player_blue_points?: boolean;

    player_red_has_finished?: boolean;
    player_red_points?: boolean;
    player_red?: User;

    player_green_has_finished?: boolean;
    player_green_points?: boolean;
    player_green?: User;

    player_yellow_has_finished?: boolean;
    player_yellow_points?: boolean;
    player_yellow?: User;

    current_playing?: PlayerColor;
}

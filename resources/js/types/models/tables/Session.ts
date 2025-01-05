import { SessionState, ValorizedVector2 } from '@/types/game';
import {Id, ForeignId, Timestamp, Timestamps} from '../index';
import { User } from './User';

export type Game_session = {
    id: Id;
    timestamps: Timestamp;
    current_round: number; //* [Default value]: 0
    board_state?: Array<ValorizedVector2>;
    session_state?: SessionState;
    player_blue?: User;
    player_red?: User;
    player_green?: User;
    player_yellow?: User;
}

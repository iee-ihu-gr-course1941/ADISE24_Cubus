import { Game_session } from "./models/tables/Session";

export type SessionState = 'waiting' | 'playing' | 'paused' | 'complete';
export type PlayerColor = 'blue' | 'green' | 'red' | 'yellow';

export type BoardState = Array<ValorizedVector2>;

export type GameResponse = {
    session: Game_session;
    player: Player;
}

type Player = {
    name?: string;
    icon?: string;
    public_id?: string;
    session_color?: PlayerColor;
    session_valie_pieces: Array<boolean>;
}

export type Vector2 = {
    x: number;
    y: number;
}

export type ValorizedVector2 = Vector2 & {
    data: PlayerColor
}

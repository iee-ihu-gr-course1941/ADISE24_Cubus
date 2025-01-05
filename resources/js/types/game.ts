import { BoardUpdateEvent } from "./connection";
import { GameState } from "./models/tables/Session";
import { PieceCode, PieceRotation } from "./piece";

export type SessionState = 'waiting' | 'playing' | 'paused' | 'complete';
export type PlayerColor = 'blue' | 'green' | 'red' | 'yellow';

export type BoardState = Array<ValorizedVector2>;

export type GameResponse = {
    session: GameState;
    player: PlayerState;
}

type Player = {
    name?: string;
    icon?: string;
    public_id?: string;
}

type PlayerState = Player & {
    session_color?: PlayerColor;
    session_valid_pieces: Array<boolean>;
}

export type Vector2 = {
    x: number;
    y: number;
}

export type ValorizedVector2 = Vector2 & {
    data: PlayerColor
}

export type MovePayload = {
    code: PieceCode;
    origin_x: number;
    origin_y: number;
    rotation: PieceRotation;
    flip: boolean;
}

export type MoveResponse = {
    valid: boolean;
    origin_x: number;
    origin_y: number;
    block_positions: Array<Vector2>
}

export type OpponentMove = BoardUpdateEvent;

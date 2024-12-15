export type PieceCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
export type PieceRotation = 0 | 1 | 2 | 3; //* [0deg, 90deg, 180deg, 270deg]

export type MovePayload = {
    code: PieceCode; //! [0-20]
    origin_position: Vector2; //! [0-19]
    rotation: PieceRotation;
    flip: boolean;
}

export type PieceData = {
    center_offset: Vector2;
    origin_center_distance: Vector2;
    code: PieceCode;
    block_positions: Vector2[];
}

export type Vector2 = {
    x: number;
    y: number;
}

export type MoveType = 'move' | 'rotate' | 'flip';

export type PlayerIdentifier = 'green' | 'red' | 'blue' | 'yellow';

export type GameState = {
    startTime?: number;
    endTime?: number | null;
    round: number;
    player_turn: PlayerIdentifier;
    player_identifier: PlayerIdentifier | null;
    player_count: number;
    state: 'Ready' | 'Finished' | 'OwnTurnPlaying' | 'OwnTurnLocked' | 'OpponentTurn';
}

export type OpponentMovePayload = {
    block_positions: Vector2[]
    destination: Vector2;
    opponent: PlayerIdentifier;
}


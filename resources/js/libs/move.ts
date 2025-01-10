import {MovePayload, OpponentMove} from '@/types/game';

export const formatMoveOrigin = (
    move: MovePayload,
    playerCount?: string,
): MovePayload => {
    if (playerCount === '2') {
        return {
            ...move,
            origin_x: Math.round((move.origin_x + 3) * 2),
            origin_y: Math.round((move.origin_y + 3) * 2),
        };
    } else {
        return {
            ...move,
            origin_x: Math.round((move.origin_x + 4.5) * 2),
            origin_y: Math.round((move.origin_y + 4.5) * 2),
        };
    }
};

export const formatOpponentMoveOrigin = (
    move: OpponentMove['move'],
    playerCount?: string,
): OpponentMove['move'] => {
    return {
        ...move,
        block_positions: [
            ...move.block_positions.map(p => ({
                x: p.x - move.origin_x,
                y: p.y - move.origin_y,
            })),
        ],
        origin_x: move.origin_x / 2 - (playerCount === '2' ? 3 : 4.5),
        origin_y: move.origin_y / 2 - (playerCount === '2' ? 3 : 4.5),
    };
};

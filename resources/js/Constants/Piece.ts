import {PieceData, PieceCode, Vector2} from '@/types/piece';
import pieces from '../../../public/pieces.json';

export const PiecePositions: {[key in PieceCode]: Vector2[]} = pieces;

export const Piece: Readonly<Record<PieceCode, PieceData>> = Object.freeze({
    0: {
        center_offset: {x: 0, y: 0},
        origin_center_distance: {x: 0.5, y: 0.5},
        code: 0,
        block_positions: PiecePositions[0],
    }, //!
    1: {
        center_offset: {x: 0.5, y: 0},
        origin_center_distance: {x: 0.5, y: 0.5},
        code: 1,
        block_positions: PiecePositions[1],
    }, //!
    2: {
        center_offset: {x: 0, y: 0},
        origin_center_distance: {x: -0.5, y: 0.5},
        code: 2,
        block_positions: PiecePositions[2],
    }, //!
    3: {
        center_offset: {x: -0.5, y: -0.5},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 3,
        block_positions: PiecePositions[3],
    }, //!
    4: {
        center_offset: {x: 0.5, y: 0},
        origin_center_distance: {x: -0.5, y: 0.5},
        code: 4,
        block_positions: PiecePositions[4],
    }, //!
    5: {
        center_offset: {x: -0.5, y: 0},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 5,
        block_positions: PiecePositions[5],
    }, //!
    6: {
        center_offset: {x: 0.5, y: -0.5},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 6,
        block_positions: PiecePositions[6],
    }, //!
    7: {
        center_offset: {x: 0, y: 0.5},
        origin_center_distance: {x: 0.5, y: 0.5},
        code: 7,
        block_positions: PiecePositions[7],
    }, //!
    8: {
        center_offset: {x: -0.5, y: 0},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 8,
        block_positions: PiecePositions[8],
    }, //!
    9: {
        center_offset: {x: 0, y: 0},
        origin_center_distance: {x: -1.5, y: 0.5},
        code: 9,
        block_positions: PiecePositions[9],
    }, //!
    10: {
        center_offset: {x: -0.5, y: 0.5},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 10,
        block_positions: PiecePositions[10],
    }, //!
    11: {
        center_offset: {x: -0.5, y: 0.5},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 11,
        block_positions: PiecePositions[11],
    }, //!
    12: {
        center_offset: {x: -0.5, y: 0},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 12,
        block_positions: PiecePositions[12],
    }, //!
    13: {
        center_offset: {x: 0, y: 0},
        origin_center_distance: {x: 1.5, y: -0.5},
        code: 13,
        block_positions: PiecePositions[13],
    }, //!
    14: {
        center_offset: {x: 0, y: 0},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 14,
        block_positions: PiecePositions[14],
    }, //!
    15: {
        center_offset: {x: 0, y: 0},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 15,
        block_positions: PiecePositions[15],
    }, //!
    16: {
        center_offset: {x: -0.5, y: 0},
        origin_center_distance: {x: -0.5, y: -0.5},
        code: 16,
        block_positions: PiecePositions[16],
    }, //!
    17: {
        center_offset: {x: 0.5, y: -0.5},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 17,
        block_positions: PiecePositions[17],
    }, //!
    18: {
        center_offset: {x: 0, y: 0},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 18,
        block_positions: PiecePositions[18],
    }, //!
    19: {
        center_offset: {x: 0, y: 0},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 19,
        block_positions: PiecePositions[19],
    }, //!
    20: {
        center_offset: {x: 0, y: 0},
        origin_center_distance: {x: 0.5, y: -0.5},
        code: 20,
        block_positions: PiecePositions[20],
    }, //!
});

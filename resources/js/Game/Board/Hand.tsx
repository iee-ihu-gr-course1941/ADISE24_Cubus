import * as THREE from 'three';
import {Piece} from './Piece/Piece';
import {PieceCode} from '@/types/piece';
import {useGameDimensions} from '@/Store/game_dimensions';
import {memo} from 'react';
import {useBoardState} from '@/Store/board_state';
import {PieceWorldPositions} from '@/Constants/Piece';

const Hand = memo(() => {
    const validPieces = useBoardState(s => s.playerState?.session_valid_pieces);

    return (
        <>
            {new Array(21).fill(0).map((_, index) => {
                if (!validPieces || !validPieces[index]) {
                    return null;
                }
                const worldPoistions = PieceWorldPositions[index as PieceCode];

                return (
                    <Piece
                        key={index}
                        code={index as PieceCode}
                        origin_x={worldPoistions.x}
                        origin_y={worldPoistions.z}
                        positionY={worldPoistions.y}
                        rotation={0}
                        flip={false}
                    />
                );
            })}
        </>
    );
});

export default Hand;

import {PIECE_GEOMETRY} from '@/Constants/geometries';
import {BOARD_PLACED_MATERIALS} from '@/Constants/materials';
import {useBoardState} from '@/Store/board_state';
import {useGameDimensions} from '@/Store/game_dimensions';
import {ValorizedVector2} from '@/types/game';
import {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {PieceMaterialComponent} from '../Piece/PieceModel';
import {COLORS} from '@/Constants/colors';

export const BoardPlacedPieces = () => {
    const [hasPlaced, setHasPlaced] = useState(false);
    const blockSize = useGameDimensions(state => state.blockSize);
    const piecesToPlace = useRef<ValorizedVector2[]>([]);
    const placedPieces = useBoardState(s => s.gameState.board_state);
    const addBoardPiece = useBoardState(state => state.addBoardPiece);
    useEffect(() => {
        setHasPlaced(true);
        if (!hasPlaced) {
            piecesToPlace.current = placedPieces ?? [];
        }
    }, [placedPieces]);

    return (
        <>
            {piecesToPlace.current.map((position, index) => {
                return (
                    <group
                        ref={_ref => {
                            if (_ref) {
                                addBoardPiece(_ref);
                            }
                        }}
                        key={index}>
                        <mesh
                            key={index}
                            position={[
                                (position.x - blockSize) / 2 - 3,
                                blockSize * 0.5,
                                (position.y - blockSize) / 2 - 3,
                            ]}
                            geometry={PIECE_GEOMETRY['block']}>
                            <PieceMaterialComponent
                                enableGlow={false}
                                color={COLORS[position.data]}
                            />
                        </mesh>
                    </group>
                );
            })}
        </>
    );
};

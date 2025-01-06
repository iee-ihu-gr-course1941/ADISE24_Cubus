import {PIECE_GEOMETRY} from '@/Constants/geometries';
import {
    BOARD_PLACED_MATERIALS,
    BOARD_SELECTED_MATERIALS,
} from '@/Constants/materials';
import {useBoardState} from '@/Store/board_state';
import {PieceCode, Vector2} from '@/types/piece';
import {useEffect, useRef} from 'react';
import * as THREE from 'three';

type Props = {
    block_positions: Vector2[];
    blockSize: number;
    pieceCode: PieceCode;
    isDragging: boolean;
};

export const PieceModel = ({
    blockSize,
    block_positions,
    pieceCode,
    isDragging,
}: Props) => {
    const blockRef = useRef<THREE.Mesh[]>([]);
    const playerIdentifier = useBoardState(
        state => state.playerState?.session_color,
    );

    const latestMove = useBoardState(state => state.move);

    useEffect(() => {
        //* Highlight latest move pieces

        if (playerIdentifier) {
            blockRef.current.forEach((block, index) => {
                // if (latestMove?.code === pieceCode) {
                //     block.material = BOARD_SELECTED_MATERIALS[playerIdentifier];
                // } else if (
                //     block.material ===
                //     BOARD_SELECTED_MATERIALS[playerIdentifier]
                // ) {
                //     block.material = BOARD_PLACED_MATERIALS[playerIdentifier];
                // }
            });
        }
    }, [latestMove, playerIdentifier]);

    const addRef = (ref: THREE.Mesh | null, index: number) => {
        if (ref) {
            blockRef.current[index] = ref;
        }
    };

    return (
        <>
            {playerIdentifier &&
                block_positions.map((position, index) => {
                    return (
                        <mesh
                            ref={ref => addRef(ref, index)}
                            key={index}
                            position={[
                                position.x * blockSize,
                                0,
                                position.y * blockSize,
                            ]}
                            geometry={PIECE_GEOMETRY['block']}
                            material={
                                index === 0
                                    ? BOARD_SELECTED_MATERIALS[playerIdentifier]
                                    : BOARD_PLACED_MATERIALS[playerIdentifier]
                            }
                        />
                    );
                })}
        </>
    );
};

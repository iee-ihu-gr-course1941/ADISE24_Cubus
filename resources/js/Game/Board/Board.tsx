import {useGameDimensions} from '@/Store/game_dimensions';
import * as THREE from 'three';
import {useBoardState} from '@/Store/board_state';
import {memo, useMemo} from 'react';
import {Grid} from '@react-three/drei';
import {OpponentsHand} from './OpponentsPiece/OpponentsHand';
import {BoardPlacedPieces} from './OpponentsPiece/BoardPlacedPieces';
import {BOARD_MATERIALS} from '@/Constants/materials';
import {useGameSettings} from '@/Store/game_settings';

export const Board = memo(() => {
    const blockSize = useGameDimensions(state => state.blockSize);
    const getGridSize = useGameDimensions(state => state.getGridSize);

    const setBoardRef = useBoardState(state => state.setBoardRef);
    const playerCount = useBoardState(state => state.gameState.player_count);

    const gridSize = useMemo(() => {
        if (!playerCount) return;
        return getGridSize(parseInt(playerCount));
    }, [playerCount, blockSize]);

    const gridHelper = useGameSettings(s => s.gridHelper);

    return (
        <>
            {gridSize && (
                <>
                    {gridHelper && (
                        <Grid
                            args={[gridSize, gridSize, 1]}
                            position-y={0.06}
                            sectionSize={blockSize}
                            sectionColor={0xa7f3d0}
                        />
                    )}
                    <mesh
                        receiveShadow
                        visible={true}
                        rotation-x={-Math.PI * 0.5 * 0}
                        position-y={-0.2}
                        ref={ref => setBoardRef(ref)}
                        scale={[gridSize, 1, gridSize]}
                        material={[
                            BOARD_MATERIALS['sides'],
                            BOARD_MATERIALS['sides'],
                            BOARD_MATERIALS['front'],
                            BOARD_MATERIALS['sides'],
                            BOARD_MATERIALS['sides'],
                            BOARD_MATERIALS['sides'],
                        ]}>
                        <boxGeometry args={[1, 0.5, 1, 100, 100]} />
                    </mesh>
                    <OpponentsHand />
                    <BoardPlacedPieces />
                </>
            )}
        </>
    );
});

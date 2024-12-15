import { useGameDimensions } from "@/Store/game_dimensions";
import * as THREE from "three";
import { useBoardState } from "@/Store/board_state";
import { memo, useMemo } from "react";
import { Grid } from "@react-three/drei";
import { OpponentsHand } from "./OpponentsPiece/OpponentsHand";
import { useControls } from "leva";

export const Board = memo(() => {

    const {showGridHelper} = useControls({
        showGridHelper: {
            label: 'Show Grid Helper',
            value: true,
        }
    })

    const blockSize = useGameDimensions(state => state.blockSize);
    const getGridSize = useGameDimensions(state => state.getGridSize);

    const setBoardRef = useBoardState(state => state.setBoardRef);
    const playerCount = useBoardState(state => state.gameState.player_count);

    const gridSize = useMemo(() => {
       return getGridSize(playerCount);
    }, [playerCount, blockSize])

    return (
        <>
            {showGridHelper && <Grid args={[gridSize, gridSize, 1]} position-y={0.06} sectionSize={blockSize} sectionColor={0x00ff00} />}
            <mesh visible={true} ref={ref => setBoardRef(ref)} scale={[gridSize, 1, gridSize]} >
                <boxGeometry args={[1, 0.1, 1]} />
                <meshBasicMaterial color={0xffffff} />
            </mesh>
            <OpponentsHand/>
        </>
    );
});

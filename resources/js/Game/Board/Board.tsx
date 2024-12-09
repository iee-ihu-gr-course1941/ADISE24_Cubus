import { useGameDimensions } from "@/Store/game_dimensions";
import { DragControls, Grid } from "@react-three/drei";
import { Piece } from "./Piece";
import { PieceCode } from "@/types/piece";
import * as THREE from "three";

export const Board = () => {
    const blockSize = useGameDimensions(state => state.blockSize);
    const gridSize = useGameDimensions(state => state.getGridSize());
    return (
        <>
            <Grid args={[gridSize, gridSize, 1]} position-y={0.06} sectionSize={blockSize} sectionColor={0x00ff00} />
            <mesh scale={[gridSize, 1, gridSize]}>
                <boxGeometry args={[1, 0.1, 1]} />
                <meshBasicMaterial color={0xffffff} />
            </mesh>
        </>
    );
}

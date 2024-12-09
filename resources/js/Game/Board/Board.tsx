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
            <Grid args={[gridSize, gridSize, 1]} sectionSize={blockSize} sectionColor={0x00ff00} />
            {
                new Array(20).fill(0).map((_, index) => {
                    const position = new THREE.Vector3((Math.random() - 0.5) * 10, 0, (Math.random() -0.5) * 10);
                    return (
                        index === 8 && <Piece key={index} pieceCode={index as PieceCode} position={[0, 0.25, 0]}/>
                    )
                })
            }
        </>
    );
}

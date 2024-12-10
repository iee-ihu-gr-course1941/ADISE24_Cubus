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
                new Array(21).fill(0).map((_, index) => {
                    const position = new THREE.Vector3((Math.random() - 0.5) * 15, 0, (Math.random() -0.5) * 15);
                    position.x = Math.round(position.x * blockSize) / blockSize;
                    position.z = Math.round(position.z * blockSize) / blockSize;
                    const rotation = Math.floor(Math.random() * 4);
                    const flip = Math.random() > 0.5;
                    return (
                      index > 15 && <Piece key={index} code={index as PieceCode} origin_position={{x: position.x, y: position.z}} rotation={rotation} flip={flip}/>
                    )
                })
            }
        </>
    );
}

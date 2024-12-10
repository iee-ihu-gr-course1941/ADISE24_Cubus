import * as THREE from "three";
import { Piece } from "./Piece";
import { PieceCode } from "@/types/piece";
import { useGameDimensions } from "@/Store/game_dimensions";

const Hand = () => {
    const blockSize = useGameDimensions(state => state.blockSize);
    const handPosition = new THREE.Vector3(10, 0, 0);
    return (
        <>
            {
                new Array(21).fill(0).map((_, index) => {
                    const position = new THREE.Vector3((Math.random() - 0.5) * 5, 0, (Math.random() -0.5) * 5).add(handPosition);
                    position.x = Math.round(position.x * blockSize) / blockSize;
                    position.z = Math.round(position.z * blockSize) / blockSize;
                    const rotation = Math.floor(Math.random() * 4);
                    const flip = Math.random() > 0.5;
                    return (
                      index > 15 && <Piece key={index} code={index as PieceCode} origin_position={{x: position.x, y: position.z}}
                      rotation={0} flip={false}/>
                    )
                })
            }
        </>
    )
}

export default Hand

import * as THREE from "three";
import { Piece } from "./Piece/Piece";
import { PieceCode } from "@/types/piece";
import { useGameDimensions } from "@/Store/game_dimensions";
import { memo } from "react";

const Hand = memo(() => {
    const blockSize = useGameDimensions(state => state.blockSize);
    const handPositions = [new THREE.Vector3(-10, 0, -2.5), new THREE.Vector3(-3.5, 0, 1.5), new THREE.Vector3(-2.5, 0, -3.5)];
    return (
        <>
            {
                new Array(21).fill(0).map((_, index) => {
                    const positionIndex = Math.floor((index/24)*3);
                    const space = 2.5;
                    let zPosition = 0;
                    let xPosition = 0;

                    xPosition = (index % 4) * space;
                    zPosition = Math.floor(index / 4) * space;

                    const position = new THREE.Vector3(positionIndex === 1 ? xPosition : zPosition, 0, positionIndex === 1 ? zPosition : xPosition).add(handPositions[positionIndex]);
                    const rotation = Math.floor(Math.random() * 4);
                    const flip = Math.random() > 0.5;

                    return (
                      index < 21 && <Piece key={index} code={index as PieceCode} origin_position={{x: position.x, y: position.z}}
                      rotation={0} flip={false}/>
                    )

                })
            }
        </>
    )
})

export default Hand

import { useBoardState } from "@/Store/board_state";
import { useGameDimensions } from "@/Store/game_dimensions";
import { OpponentMovePayload } from "@/types/piece"
import gsap from "gsap";
import { memo, useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Props = OpponentMovePayload

const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const geometry = new THREE.BoxGeometry(0.5,0.5,0.5);

export const OpponentPiece = memo(
    ({block_positions,destination,opponent}: Props) => {

    const INITIAL_POSITION = new THREE.Vector3(0, 2, -5);

    const blockSize = useGameDimensions(state => state.blockSize);
    const addBoardPiece = useBoardState(state => state.addBoardPiece);
    const beginOwnTurn = useBoardState(state => state.beginTurn);
    const [hasPlaced, setHasPlaced] = useState(false);

    const ref = useRef<THREE.Group>(null);
    const onComplete = useRef<() => void>();
    const onCompleteEnd = useRef<() => void>();

    useEffect(() => {

        onComplete.current = () => {
            if(ref.current){
                gsap.to(ref.current.position, {
                    y: blockSize * 0.5,
                    duration: calculateDuration(ref.current.position),
                    onComplete: onCompleteEnd.current
                })
            }
        }

        onCompleteEnd.current = () => {
            if(ref.current){
                addBoardPiece(ref.current);
                beginOwnTurn();
            }
        }

    }, [ref.current])

    const calculateDuration = (position: THREE.Vector3) => {
        const directionPosition = new THREE.Vector3(destination.x, blockSize * 0.5, destination.y).sub(position);
        return directionPosition.length() * 0.2;
    }

    useEffect(() => {

        if(ref.current && !hasPlaced){
            const destinationPosition = new THREE.Vector3(destination.x, 0, destination.y).sub(new THREE.Vector3(blockSize * 0.5, 0, blockSize * 0.5));
            setHasPlaced(true);
            gsap.to(ref.current.position, {
                z: destinationPosition.z,
                x: destinationPosition.x,
                duration: calculateDuration(INITIAL_POSITION),
                onComplete: onComplete.current,
            });
        }

    }, [ref.current])

    return (
        <>
            <group ref={ref} position={INITIAL_POSITION}>
                {
                    block_positions.map((position, index) => {
                        return (
                            <mesh
                                key={index}
                                position={[position.x * blockSize, 0, position.y * blockSize]}
                                geometry={geometry} material={material}
                            />
                        )
                    })
                }
            </group>
        </>
    )
});

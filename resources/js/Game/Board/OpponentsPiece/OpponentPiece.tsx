import {PIECE_GEOMETRY} from '@/Constants/geometries';
import {BOARD_PLACED_MATERIALS} from '@/Constants/materials';
import {useBoardState} from '@/Store/board_state';
import {useGameDimensions} from '@/Store/game_dimensions';
import {OpponentMove} from '@/types/game';
import gsap from 'gsap';
import {memo, useEffect, useRef, useState} from 'react';
import * as THREE from 'three';

type Props = OpponentMove['move'];

export const OpponentPiece = memo((move: Props) => {
    const {block_positions, origin_x, origin_y, player_color} = move;
    const ORIGIN_POSITION = new THREE.Vector3(0, 2, -5);
    console.log('positioning enemy piece at: ', origin_x, origin_y);

    const blockSize = useGameDimensions(state => state.blockSize);
    const addBoardPiece = useBoardState(state => state.addBoardPiece);
    const changeTurn = useBoardState(state => state.changeTurn);
    const [hasPlaced, setHasPlaced] = useState(false);

    const ref = useRef<THREE.Group>(null);
    const onComplete = useRef<() => void>();
    const onCompleteEnd = useRef<() => void>();

    useEffect(() => {
        onComplete.current = () => {
            if (ref.current) {
                gsap.to(ref.current.position, {
                    y: blockSize * 0.5,
                    duration: calculateDuration(ref.current.position),
                    onComplete: onCompleteEnd.current,
                });
            }
        };

        onCompleteEnd.current = () => {
            if (ref.current) {
                addBoardPiece(ref.current);
                changeTurn();
            }
        };
    }, [ref.current]);

    const calculateDuration = (position: THREE.Vector3) => {
        const directionPosition = new THREE.Vector3(
            origin_x,
            blockSize * 0.5,
            origin_y,
        ).sub(position);
        return directionPosition.length() * 0.2;
    };

    useEffect(() => {
        if (ref.current && !hasPlaced) {
            const destinationPosition = new THREE.Vector3(
                origin_x,
                0,
                origin_y,
            ).sub(new THREE.Vector3(blockSize * 0.5, 0, blockSize * 0.5));
            setHasPlaced(true);
            gsap.to(ref.current.position, {
                z: destinationPosition.z,
                x: destinationPosition.x,
                duration: calculateDuration(ORIGIN_POSITION),
                onComplete: onComplete.current,
            });
        }
    }, [ref.current]);

    return (
        <>
            <group ref={ref} position={ORIGIN_POSITION}>
                {block_positions.map((position, index) => {
                    return (
                        <mesh
                            key={index}
                            position={[
                                position.x * blockSize,
                                0,
                                position.y * blockSize,
                            ]}
                            geometry={PIECE_GEOMETRY['block']}
                            material={BOARD_PLACED_MATERIALS[player_color]}
                        />
                    );
                })}
            </group>
        </>
    );
});

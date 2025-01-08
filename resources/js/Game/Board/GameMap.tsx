import { useFrame, useThree} from '@react-three/fiber';
import {Lights} from '../Ligths';
import {Board} from './Board';
import Hand from './Hand';
import {useEffect, useRef} from 'react';
import {useBoardState} from '@/Store/board_state';
import {useTimerStore} from '@/Store/timer';
import * as THREE from 'three';
import {lerp} from 'three/src/math/MathUtils.js';
import {
    CAMERA_ANIMATION_DURATION,
    DESTINATION_CAMERA_LOOK_AT,
    DESTINATION_CAMERA_POSITION,
    ORIGIN_CAMERA_LOOK_AT,
    ORIGIN_CAMERA_POSITION,
} from '@/Constants/camera';
import {Spaceship} from '../Environment/Spaceship';

const GameMap = () => {
    const playerIdentifier = useBoardState(
        state => state.gameState.current_playing,
    );
    const ui_state = useBoardState(state => state.gameState.ui_state);
    const skyTextureRef = useRef<THREE.CubeTexture>();

    const {time} = useTimerStore();
    const timeRef = useRef(0);

    const {scene} = useThree();

    useEffect(() => {
        const skyLoader = new THREE.CubeTextureLoader();
        const skyTexture = skyLoader.load([
            '/sky/px.png',
            '/sky/nx.png',
            '/sky/py.png',
            '/sky/ny.png',
            '/sky/pz.png',
            '/sky/nz.png',
        ]);
        skyTextureRef.current = skyTexture;
        skyTexture.anisotropy = 8;
        scene.backgroundRotation = new THREE.Euler(3.14, 0, -3.14);
        scene.background = skyTexture;
        scene.backgroundBlurriness = 0;
    }, []);

    useFrame(({camera}, delta) => {
        //* Camera Animation
        if (
            time === 0 ||
            (ui_state !== 'Ready' &&
                ui_state !== 'Finished' &&
                ui_state !== 'Starting')
        )
            return;
        timeRef.current = Math.min(
            CAMERA_ANIMATION_DURATION / 1000,
            timeRef.current + delta,
        );

        const strength = timeRef.current / (CAMERA_ANIMATION_DURATION / 1000);

        const lerpedLookAt = new THREE.Vector3(
            lerp(
                ORIGIN_CAMERA_LOOK_AT.x,
                DESTINATION_CAMERA_LOOK_AT.x,
                strength,
            ),
            lerp(
                ORIGIN_CAMERA_LOOK_AT.y,
                -DESTINATION_CAMERA_LOOK_AT.z * 2,
                strength,
            ),
            lerp(
                ORIGIN_CAMERA_LOOK_AT.z,
                DESTINATION_CAMERA_LOOK_AT.y,
                strength,
            ),
        );

        const lerpedPosition = new THREE.Vector3(
            lerp(
                ORIGIN_CAMERA_POSITION.x,
                DESTINATION_CAMERA_POSITION.x,
                strength,
            ),
            lerp(
                ORIGIN_CAMERA_POSITION.y,
                DESTINATION_CAMERA_POSITION.y,
                strength,
            ),
            lerp(
                ORIGIN_CAMERA_POSITION.z,
                DESTINATION_CAMERA_POSITION.z,
                strength,
            ),
        );

        camera.position.set(
            lerpedPosition.x,
            lerpedPosition.y,
            lerpedPosition.z,
        );
        camera.lookAt(0, lerpedLookAt.y, 0);
        camera.updateProjectionMatrix();
    });

    return (
        <>

            <Lights />
            <Board />
            {playerIdentifier &&
                (ui_state === 'OpponentTurn' ||
                    ui_state === 'OwnTurnLocked' ||
                    ui_state === 'OwnTurnPlaying') &&
                <Hand />}
            <Spaceship />
        </>
    );
};

export default GameMap;

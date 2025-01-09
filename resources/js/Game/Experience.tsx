import {Environment, OrbitControls} from '@react-three/drei';
import {Camera, Canvas, Object3DNode, useThree} from '@react-three/fiber';
import {Board} from './Board/Board';
import {Lights} from './Ligths';
import {Perf} from 'r3f-perf';
import {memo, useEffect, useMemo, useRef} from 'react';
import GameMap from './Board/GameMap';
import {Interface} from './Interface';
import {BoardControls} from './Board/BoardControls';
import * as THREE from 'three';
import {
    DESTINATION_CAMERA_LOOK_AT,
    DESTINATION_CAMERA_POSITION,
    FINISHED_CAMERA_LOOK_AT,
    FINISHED_CAMERA_POSITION,
    ORIGIN_CAMERA_LOOK_AT,
    ORIGIN_CAMERA_POSITION,
} from '@/Constants/camera';
import {useBoardState} from '@/Store/board_state';

const INITIAL_CAMERA_PROPS = {
    fov: 85,
    near: 0.1,
    far: 200,
};

export const Experience = memo(() => {
    const ui_state = useBoardState(state => state.gameState.ui_state);
    const isGameOnGoing = useBoardState(state => state.isGameOnGoing);
    return (
        <>
            <Canvas
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    pixelRatio: Math.min(2, window.devicePixelRatio),
                }}
                onCreated={({camera, gl}) => {
                    if (ui_state === 'Ready') {
                        camera.position.set(
                            ORIGIN_CAMERA_POSITION.x,
                            ORIGIN_CAMERA_POSITION.y,
                            ORIGIN_CAMERA_POSITION.z,
                        );
                        camera.lookAt(
                            ORIGIN_CAMERA_LOOK_AT.x,
                            ORIGIN_CAMERA_LOOK_AT.y,
                            ORIGIN_CAMERA_LOOK_AT.z,
                        );
                    } else if (isGameOnGoing()) {
                        camera.position.set(
                            DESTINATION_CAMERA_POSITION.x,
                            DESTINATION_CAMERA_POSITION.y,
                            DESTINATION_CAMERA_POSITION.z,
                        );
                        camera.lookAt(
                            DESTINATION_CAMERA_LOOK_AT.x,
                            DESTINATION_CAMERA_LOOK_AT.y,
                            DESTINATION_CAMERA_LOOK_AT.z,
                        );
                    } else if (ui_state === 'Finished') {
                        camera.position.set(
                            FINISHED_CAMERA_POSITION.x,
                            FINISHED_CAMERA_POSITION.y,
                            FINISHED_CAMERA_POSITION.z,
                        );
                        camera.lookAt(
                            FINISHED_CAMERA_LOOK_AT.x,
                            FINISHED_CAMERA_LOOK_AT.y,
                            FINISHED_CAMERA_LOOK_AT.z,
                        );
                    }
                }}
                camera={INITIAL_CAMERA_PROPS}>
                <color attach={'background'} args={['#535353']} />
                <Perf position="top-left" />
                <BoardControls />
                <GameMap />
            </Canvas>
            <Interface />
        </>
    );
});

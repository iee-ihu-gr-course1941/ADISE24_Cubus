import {Canvas} from '@react-three/fiber';
import {memo} from 'react';
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
import {useLoadedModels} from '@/Store/models_state';
import {GameState} from '@/types/game';
import {Loading} from './Loading';
import {Perf} from 'r3f-perf';
import {Space} from './Environment/Space/Space';
import {loadModels} from '@/Hooks/loadModels';

const INITIAL_CAMERA_PROPS = {
    fov: 85,
    near: 0.1,
    far: 100,
};

export const Experience = memo(() => {
    const ui_state = useBoardState(state => state.gameState.ui_state);
    const isGameOnGoing = useBoardState(state => state.isGameOnGoing);
    const haveModelsLoaded = useLoadedModels(s => s.hasLoaded);
    return (
        <>
            <Canvas
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    pixelRatio: Math.min(2, window.devicePixelRatio),
                    outputColorSpace: THREE.SRGBColorSpace,
                }}
                onCreated={({camera}) => {
                    updateCamera(camera, ui_state, isGameOnGoing);
                }}
                camera={INITIAL_CAMERA_PROPS}>
                <color attach={'background'} args={['#000000']} />
                {/* <Perf position="top-left" /> */}
                <BoardControls />
                {haveModelsLoaded && <GameMap />}
                <Space />
                <InitExperience />
            </Canvas>
            <Interface />
            <Loading />
        </>
    );
});

const InitExperience = memo(() => {
    loadModels();
    return <></>;
});

const updateCamera = (
    camera: THREE.Camera,
    ui_state: GameState['ui_state'],
    isGameOnGoing: () => boolean,
) => {
    if (ui_state === 'Ready' || ui_state === 'Finished') {
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
    }
};

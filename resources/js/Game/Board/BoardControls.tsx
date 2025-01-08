import {DESTINATION_CAMERA_LOOK_AT} from '@/Constants/camera';
import {useBoardState} from '@/Store/board_state';
import {OrbitControls} from '@react-three/drei';
import * as THREE from 'three';

export const BoardControls = () => {
    const ui_state = useBoardState(state => state.gameState.ui_state);
    const isGameOnGoing = useBoardState(state => state.isGameOnGoing);
    return (
        <>
            <OrbitControls
                enabled={isGameOnGoing()}
                target={new THREE.Vector3(0, 0, 0)}
                minPolarAngle={Math.PI * 0.025}
                maxPolarAngle={Math.PI * 0.35}
                maxAzimuthAngle={Math.PI * 0.05}
                minAzimuthAngle={Math.PI * -0.05}
                minDistance={4}
                maxDistance={16}
                enableZoom={true}
                makeDefault
                enableDamping
            />
        </>
    );
};

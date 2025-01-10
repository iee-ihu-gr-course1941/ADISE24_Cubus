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
                enablePan={false}
                target={new THREE.Vector3(0, 0, 0)}
                minPolarAngle={Math.PI * 0.035}
                maxPolarAngle={Math.PI * 0.36}
                maxAzimuthAngle={Math.PI * 0.1}
                minAzimuthAngle={Math.PI * -0.1}
                minDistance={6}
                maxDistance={24}
                enableZoom={true}
                makeDefault
                enableDamping
            />
        </>
    );
};

import { DESTINATION_CAMERA_LOOK_AT } from "@/Constants/camera";
import { useBoardState } from "@/Store/board_state";
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three";

export const BoardControls = () => {
    const state = useBoardState(state => state.gameState.ui_state)
    return (
        <>
            <OrbitControls
                enabled={state !== 'Ready' && state !== 'Finished' && state !== 'Starting'}
                target={DESTINATION_CAMERA_LOOK_AT}

                minPolarAngle={Math.PI * 0.025} maxPolarAngle={Math.PI * 0.35}
                maxAzimuthAngle={Math.PI * 0.05} minAzimuthAngle={Math.PI * -0.05}

                makeDefault enableDamping
            />
        </>
    )
}

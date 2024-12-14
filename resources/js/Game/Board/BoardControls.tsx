import { OrbitControls } from "@react-three/drei"
import * as THREE from "three";

export const BoardControls = () => {
    return (
        <>
            <OrbitControls
                target={new THREE.Vector3(0, 0, 2.5)}

                minPolarAngle={Math.PI * 0.1} maxPolarAngle={Math.PI * 0.35}
                maxAzimuthAngle={Math.PI * 0.2} minAzimuthAngle={Math.PI * -0.2}

                makeDefault enableDamping
            />
        </>
    )
}

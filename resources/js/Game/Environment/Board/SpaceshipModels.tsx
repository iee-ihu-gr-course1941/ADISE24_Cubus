import {useLoadedModels} from '@/Store/models_state';
import {useFrame} from '@react-three/fiber';
import {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';

export const SpaceshipModels = () => {
    const spaceshipRef = useRef<THREE.Object3D | null>(null);
    const model = useLoadedModels(s => s.models.spaceshipMini);
    const [target, setTarget] = useState(new THREE.Vector3());

    useEffect(() => {
        setTarget(generateRandomTarget());
    }, []);

    const generateRandomTarget = () => {
        let x, y, z;

        do {
            x = THREE.MathUtils.randFloat(-80, 80);
            y = THREE.MathUtils.randFloat(-40, 40);
            z = THREE.MathUtils.randFloat(-12.5, -80);
        } while (x > -10 && x < 10 && z > -10 && z < 10 && y > -2 && y < 2);

        return new THREE.Vector3(x, y, z);
    };

    useFrame(() => {
        if (spaceshipRef.current) {
            const position = spaceshipRef.current.position;

            const direction = target.clone().sub(position).normalize();
            const speed = 0.01;
            position.add(direction.multiplyScalar(speed));

            if (position.distanceTo(target) < 0.5) {
                setTarget(generateRandomTarget());
            }

            spaceshipRef.current.lookAt(target);
        }
    });
    const scale = 0.8;

    if (model) {
        return (
            <>
                <primitive
                    scale={[scale, scale, scale]}
                    position={[25, 10, -20]}
                    ref={spaceshipRef}
                    object={model}
                />
            </>
        );
    } else {
        return null;
    }
};

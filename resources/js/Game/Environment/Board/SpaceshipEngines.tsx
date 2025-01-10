import {shaderMaterial} from '@react-three/drei';
import * as THREE from 'three';
import vertexShader from '../../../../shaders/spaceship/engines/pattern_1/vertex.glsl';
import fragmentShader from '../../../../shaders/spaceship/engines/pattern_1/fragment.glsl';
import {extend} from '@react-three/fiber';
import {memo, useEffect, useMemo, useRef} from 'react';
import {useBoardState} from '@/Store/board_state';
import {useGameSettings} from '@/Store/game_settings';

const geometry = new THREE.BoxGeometry(1, 1, 1);

const EngineMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color(0xf59e0b),
        uColorIntensity: 10,
        uOpacity: 1,
    },
    vertexShader,
    fragmentShader,
);
extend({EngineMaterial});
export const SpaceshipEngines = () => {
    const isGameOnGoing = useBoardState(s => s.isGameOnGoing);
    const ui_state = useBoardState(s => s.gameState.ui_state);

    const {uOpacity, uIntensity} = useMemo(() => {
        const isLowOrbit = isGameOnGoing();
        if (isLowOrbit) {
            return {
                uOpacity: 0.49,
                uIntensity: 4.46,
            };
        } else {
            return {
                uOpacity: 1.0,
                uIntensity: 8.0,
            };
        }
    }, [ui_state]);

    return (
        <>
            <SpaceshipEngine
                uOpacity={uOpacity}
                uIntensity={uIntensity}
                position={[-3.5, -1.8, 10.5]}
            />
            <SpaceshipEngine
                uOpacity={uOpacity}
                uIntensity={uIntensity}
                position={[3.8, -1.8, 10.5]}
            />
        </>
    );
};

type EngineMaterialProps = {
    uOpacity: number;
    uIntensity: number;
    position: [number, number, number];
};

const SpaceshipEngine = ({
    uIntensity,
    uOpacity,
    position,
}: EngineMaterialProps) => {
    const ref = useRef<THREE.ShaderMaterial>(null);
    const enableLights = useGameSettings(s => s.enableLights);

    useEffect(() => {
        if (ref.current) {
            ref.current.uniforms.uOpacity.value = uOpacity;
            ref.current.uniforms.uColorIntensity.value = uIntensity;
        }
    }, [uOpacity, uIntensity, ref]);
    return (
        <>
            <mesh
                rotation={[0.07, 0, 0]}
                scale={[2, 2.1, 0.4]}
                position={position}
                geometry={geometry}>
                <engineMaterial ref={ref} />
            </mesh>
            {enableLights && (
                <pointLight
                    position={position}
                    position-y={position[1] - 0.5}
                    position-z={position[2] + 1}
                    color={0xf59e0b}
                    intensity={uIntensity}
                    distance={Math.min(uIntensity * 0.5, 2.5)}
                    decay={0}
                />
            )}
        </>
    );
};

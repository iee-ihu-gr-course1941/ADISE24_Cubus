import {shaderMaterial} from '@react-three/drei';
import {extend, useFrame} from '@react-three/fiber';
import {memo, useEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import vertexShader from '../../../../shaders/spaceship/air_modules/pattern_1/vertex.glsl';
import fragmentShader from '../../../../shaders/spaceship/air_modules/pattern_1/fragment.glsl';
import {useBoardState} from '@/Store/board_state';
import {useGameSettings} from '@/Store/game_settings';

const geometry = new THREE.PlaneGeometry(1, 1, 48, 48);
geometry.rotateX(-Math.PI / 2);

const closeGeometry = new THREE.PlaneGeometry(1, 1, 96, 96);
closeGeometry.rotateX(-Math.PI / 2);

const AirModuleMaterial = shaderMaterial(
    {
        uTime: 0,
        uSpeed: 0.15,
        uAmplitude: 0.2,
        uColorStart: new THREE.Color(0x3b3946),
        uColorEnd: new THREE.Color(0x22d1e6),
        uRandomFactor: 0,
        uDepth: 0.8,
    },
    vertexShader,
    fragmentShader,
);

extend({AirModuleMaterial});

export const SpaceshipAirModules = memo(() => {
    const isGameOnGoing = useBoardState(s => s.isGameOnGoing);
    const ui_state = useBoardState(s => s.gameState.ui_state);

    const depth = 0.6;
    const colorStart = '#1f1131';
    const speed = useMemo(() => {
        if (isGameOnGoing()) {
            return 0.15;
        } else {
            return 0.3;
        }
    }, [isGameOnGoing, ui_state]);
    const height = 0.85 - depth;
    return (
        <>
            <AirModule
                colorStart={colorStart}
                depth={depth}
                position={[-7.8, height, 7.85]}
                isClose={true}
                speed={speed}
            />
            <AirModule
                colorStart={colorStart}
                depth={depth}
                position={[7.8, height, 7.85]}
                isClose={true}
                speed={speed}
            />
            <AirModule
                colorStart={colorStart}
                depth={depth}
                position={[7.8, height, -7.85]}
                speed={speed}
            />
            <AirModule
                colorStart={colorStart}
                depth={depth}
                position={[-7.8, height, -7.85]}
                speed={speed}
            />
        </>
    );
});
type AirModuleProps = {
    position: [number, number, number];
    isClose?: boolean;
    depth?: number;
    colorStart?: string;
    speed?: number;
};
const AirModule = ({
    position,
    isClose = false,
    depth,
    colorStart,
    speed,
}: AirModuleProps) => {
    const lightRef = useRef<THREE.PointLight>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const enableLights = useGameSettings(s => s.enableLights);

    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta;
        }
        if (lightRef.current) {
            const speed = 0.0015;
            const radius = 0.5;
            lightRef.current.position.x =
                position[0] + Math.sin(Date.now() * speed) * radius;
            lightRef.current.position.y =
                2 + Math.sin(Date.now() * speed) * 0.1;
            lightRef.current.position.z =
                position[2] + Math.cos(Date.now() * speed) * radius;
        }
    });

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uRandomFactor.value = 3;
        }
    }, [materialRef]);

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uSpeed.value = speed;
        }
    }, [speed, materialRef]);

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uDepth.value =
                depth ?? materialRef.current.uniforms.uDepth.value;

            materialRef.current.uniforms.uColorStart.value = new THREE.Color(
                colorStart,
            );
        }
    }, [depth, colorStart, materialRef]);

    return (
        <>
            <mesh
                scale={[2.5, 1, 2.5]}
                position={position}
                geometry={isClose ? closeGeometry : geometry}>
                <airModuleMaterial wireframe={false} ref={materialRef} />
            </mesh>
            {isClose && enableLights && (
                <pointLight
                    ref={lightRef}
                    position={position}
                    intensity={1.5}
                    distance={3.5}
                    position-y={2}
                    color={0x22d1e6}
                    decay={0}
                />
            )}
        </>
    );
};

import {shaderMaterial} from '@react-three/drei';
import {extend, useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../../../shaders/spaceship/noise_lights/pattern_2/vertex.glsl';
import fragmentShader from '../../../shaders/spaceship/noise_lights/pattern_2/fragment.glsl';
import {Fragment, memo, useEffect, useMemo, useRef} from 'react';
import {PlayerColor} from '@/types/game';
import {COLORS} from '@/Constants/colors';

const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
planeGeometry.rotateX(Math.PI * 0.5);

const closePlaneGeometry = new THREE.PlaneGeometry(1, 1, 72, 72);
closePlaneGeometry.rotateX(Math.PI * 0.5);

const POSITIONS: {
    [key: number]: {
        left: [number, number, number];
        right: [number, number, number];
    };
} = {
    0: {
        left: [-3.6, 0.7, -7.9],
        right: [3.6, 0.7, -7.9],
    },
    1: {
        left: [-7.8, 0.7, -3.7],
        right: [-7.8, 0.7, 3.6],
    },
    2: {
        left: [7.8, 0.7, -3.7],
        right: [7.8, 0.7, 3.5],
    },
};

const LightNoiseMaterial = shaderMaterial(
    {
        uColor: new THREE.Color(0xeab308),
        uTime: 0,
        uSpeed: 0.05,
        uAmplitude: 0.2,
        uLightColor: new THREE.Color(0xffffff),
        uEndColor: new THREE.Color(0x7dd3fc),
        uRandomFactor: 0,
    },
    vertexShader,
    fragmentShader,
);

extend({LightNoiseMaterial});
type Props = {
    playerColor: PlayerColor;
};
export const SpaceshipPlayerColors = memo(({playerColor}: Props) => {
    return (
        <>
            <LightObject
                isPlayer={true}
                color={COLORS[playerColor]}
                position={[-3.6, 0.7, 7.9]}
            />
            <LightObject
                isPlayer={true}
                color={COLORS[playerColor]}
                position={[3.6, 0.7, 7.9]}
            />
            {Object.keys(COLORS)
                .filter(color => color !== playerColor)
                .map((_color, index) => {
                    const color = _color as keyof typeof COLORS;
                    return (
                        <Fragment key={index}>
                            <LightObject
                                color={COLORS[color]}
                                position={POSITIONS[index].left}
                            />
                            <LightObject
                                color={COLORS[color]}
                                position={POSITIONS[index].right}
                            />
                        </Fragment>
                    );
                })}
        </>
    );
})

type LightProps = {
    color: number;
    position: [number, number, number];
    isPlayer?: boolean;
};

const LightObject = ({color, position, isPlayer = false}: LightProps) => {
    const ref = useRef<THREE.ShaderMaterial>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    useFrame(({camera}) => {
        if (lightRef.current) {
            const cameraDistance = camera.position.distanceTo(
                new THREE.Vector3(position[0], position[1], position[2]),
            );
            const maxIntensity = 4;
            const minIntensity = 1;
            const maxDistance = 1.5;
            const minDistance = 0.8;
            const distanceOffset = 16;
            lightRef.current.distance = Math.min(
                maxDistance,
                Math.max(minDistance, distanceOffset - cameraDistance),
            );
            lightRef.current.intensity = Math.min(
                maxIntensity,
                Math.max(minIntensity, distanceOffset - cameraDistance) * 2.5,
            );
        }
    });
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.uniforms.uTime.value += delta;
            ref.current.uniforms.uSpeed.value = 0.15;
            ref.current.uniforms.uColor.value = new THREE.Color(color);
            ref.current.uniforms.uEndColor.value = new THREE.Color(0xffffff);
            ref.current.uniforms.uAmplitude.value =
                0.1 + Math.sin(delta * 0.5) * 2.5;
        }
    });

    useEffect(() => {
        if (ref.current) {
            ref.current.uniforms.uRandomFactor.value =
                Math.random() * 2 +
                Math.abs(position[0] + position[1] + position[2]) * 0.25;
        }
    }, [ref]);

    const Mesh = useMemo(() => {
        if (isPlayer) {
            return (
                <mesh
                    position={position}
                    scale={[1.5, 0, 1.5]}
                    geometry={closePlaneGeometry}>
                    <lightNoiseMaterial ref={ref} side={THREE.DoubleSide} />
                </mesh>
            );
        } else {
            return (
                <mesh
                    position={position}
                    scale={[1.5, 0, 1.5]}
                    geometry={planeGeometry}>
                    <lightNoiseMaterial ref={ref} side={THREE.DoubleSide} />
                </mesh>
            );
        }
    }, [position, isPlayer]);

    return (
        <>
            {Mesh}
            <pointLight
                ref={lightRef}
                position={position}
                position-y={position[1] * 2}
                color={color}
                decay={0}
            />
        </>
    );
};

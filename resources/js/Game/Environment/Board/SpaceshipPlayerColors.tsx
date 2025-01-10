import {shaderMaterial} from '@react-three/drei';
import {extend, useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../../../../shaders/spaceship/noise_lights/pattern_2/vertex.glsl';
import fragmentShader from '../../../../shaders/spaceship/noise_lights/pattern_2/fragment.glsl';
import {Fragment, memo, useEffect, useMemo, useRef} from 'react';
import {PlayerColor} from '@/types/game';
import {COLORS} from '@/Constants/colors';
import {usePlayerPositions} from '@/Store/player_positions';

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
        left: [-3.6, 0.7, 7.9],
        right: [3.6, 0.7, 7.9],
    },
    1: {
        left: [7.8, 0.7, -3.7],
        right: [7.8, 0.7, 3.5],
    },
    2: {
        left: [-3.6, 0.7, -7.9],
        right: [3.6, 0.7, -7.9],
    },
    3: {
        left: [-7.8, 0.7, -3.7],
        right: [-7.8, 0.7, 3.6],
    },
};

const LightNoiseMaterial = shaderMaterial(
    {
        uColor: new THREE.Color(0xeab308),
        uTime: 0,
        uSpeed: 0.05,
        uAmplitude: 0,
        uLightColor: new THREE.Color(0xffffff),
        uEndColor: new THREE.Color(0x7dd3fc),
        uRandomFactor: 0,
    },
    vertexShader,
    fragmentShader,
);

extend({LightNoiseMaterial});
type Props = {
    playerColor?: PlayerColor;
};
export const SpaceshipPlayerColors = memo(({playerColor}: Props) => {
    const setPlayerPosition = usePlayerPositions(s => s.setPlayerPosition);
    useEffect(() => {
        if (!playerColor) return;
        setPlayerPosition(playerColor, {
            x: (POSITIONS[0].left[0] + POSITIONS[0].right[0]) * 0.5,
            y: (POSITIONS[0].left[2] + POSITIONS[0].right[2]) * 0.5,
        });
    }, [playerColor]);
    if (!playerColor) return null;

    const playerIndex = Object.keys(COLORS).indexOf(playerColor);

    const allColors = Object.keys(COLORS);
    let nextColors = [];
    for (let i = 1; i < allColors.length; i++) {
        nextColors.push(allColors[(i + playerIndex) % allColors.length]);
    }

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
            {nextColors.map((_color, index) => {
                const indexMapping = index + 1;

                setPlayerPosition(_color as PlayerColor, {
                    x:
                        (POSITIONS[indexMapping].left[0] +
                            POSITIONS[indexMapping].right[0]) *
                        0.5,
                    y:
                        (POSITIONS[indexMapping].left[2] +
                            POSITIONS[indexMapping].right[2]) *
                        0.5,
                });
                const color = _color as keyof typeof COLORS;
                return (
                    <Fragment key={indexMapping}>
                        <LightObject
                            color={COLORS[color]}
                            position={POSITIONS[indexMapping].left}
                        />
                        <LightObject
                            color={COLORS[color]}
                            position={POSITIONS[indexMapping].right}
                        />
                    </Fragment>
                );
            })}
        </>
    );
});

type LightProps = {
    color: number;
    position: [number, number, number];
    isPlayer?: boolean;
};

const LightObject = memo(({color, position, isPlayer = false}: LightProps) => {
    const ref = useRef<THREE.ShaderMaterial>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.uniforms.uTime.value += delta;
        }
    });

    useEffect(() => {
        if (ref.current) {
            ref.current.uniforms.uSpeed.value = 0.15;
            ref.current.uniforms.uColor.value = new THREE.Color(color);
            ref.current.uniforms.uEndColor.value = new THREE.Color(0xffffff);
            ref.current.uniforms.uAmplitude.value = Math.random() * 0.1 + 0.05;
        }
    }, [ref, color]);

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
                intensity={4}
                distance={1.5}
                decay={0}
            />
        </>
    );
});

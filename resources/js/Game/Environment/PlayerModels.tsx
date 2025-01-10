import {COLORS} from '@/Constants/colors';
import {useBoardState} from '@/Store/board_state';
import {usePlayerPositions} from '@/Store/player_positions';
import gsap from 'gsap';
import {memo, useEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import vertexShader from '../../../shaders/model/hologramVertex.glsl';
import fragmentShader from '../../../shaders/model/hologramFragment.glsl';
import {extend, useFrame} from '@react-three/fiber';
import {shaderMaterial} from '@react-three/drei';
import {useLoadedModels} from '@/Store/models_state';

export const PlayerModels = memo(() => {
    const models = useLoadedModels(s => s.models);
    const positions = usePlayerPositions();
    const modelHeight = 2.3;
    const isPlayerAlive = useBoardState(state => state.isPlayerAlive);
    const isGameOnGoing = useBoardState(state => state.isGameOnGoing);

    //* Keep these unused variables to cause re-renders!
    const ui_state = useBoardState(state => state.gameState.ui_state);
    const gameState = useBoardState(state => state.gameState);
    //*

    const Models = useMemo(() => {
        return (
            <>
                <PlayerModel
                    model={models.duck.green}
                    position={[
                        positions.playerPositions.green?.x ?? 0,
                        modelHeight,
                        positions.playerPositions.green?.y ?? 0,
                    ]}
                    isPlayerAlive={isPlayerAlive('green')}
                />
                <PlayerModel
                    model={models.duck?.red}
                    position={[
                        positions.playerPositions.red?.x ?? 0,
                        modelHeight,
                        positions.playerPositions.red?.y ?? 0,
                    ]}
                    isPlayerAlive={isPlayerAlive('red')}
                />
                <PlayerModel
                    model={models.duck?.blue}
                    position={[
                        positions.playerPositions.blue?.x ?? 0,
                        modelHeight,
                        positions.playerPositions.blue?.y ?? 0,
                    ]}
                    isPlayerAlive={isPlayerAlive('blue')}
                />
                <PlayerModel
                    model={models.duck?.yellow}
                    position={[
                        positions.playerPositions.yellow?.x ?? 0,
                        modelHeight,
                        positions.playerPositions.yellow?.y ?? 0,
                    ]}
                    isPlayerAlive={isPlayerAlive('yellow')}
                />
            </>
        );
    }, [models.duck, modelHeight, positions, gameState]);
    if (isGameOnGoing()) {
        return <>{Models}</>;
    } else {
        return null;
    }
});

type Props = {
    model?: THREE.Object3D | null;
    position: [number, number, number];
    isPlayerAlive: boolean;
};
const DURATION = 0.25;
const PlayerModel = ({model, position, isPlayerAlive}: Props) => {
    const ref = useRef<THREE.Object3D | null>(null);
    const initialMaterialRef = useRef<{[key: string]: THREE.Material | null}>(
        {},
    );
    const isAnimating = useRef(false);
    const handleClick = () => {
        if (ref.current && !isAnimating.current && isPlayerAlive) {
            isAnimating.current = true;
            const offset = 0.5;
            gsap.to(ref.current.position, {
                y: ref.current.position.y + offset,
                duration: DURATION,
                onComplete: () => {
                    if (ref.current) {
                        gsap.to(ref.current.position, {
                            y: ref.current.position.y - offset,
                            duration: DURATION * 0.75,
                            onComplete: () => {
                                isAnimating.current = false;
                            },
                        });
                    }
                },
            });
        }
    };
    const scale = 0.85;

    const Model = useMemo(() => {
        if (model) {
            model.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    if (!initialMaterialRef.current?.[child.name]) {
                        initialMaterialRef.current[child.name] = child.material;
                    }
                    if (isPlayerAlive) {
                        child.material = initialMaterialRef.current[child.name];
                    } else {
                        child.material = new THREE.ShaderMaterial({
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            uniforms: {
                                uTime: {
                                    value: 0,
                                },
                                uColor: {
                                    value: new THREE.Color(
                                        child.material.color,
                                    ),
                                },
                            },
                            depthWrite: false,
                            transparent: true,
                            blending: THREE.AdditiveBlending,
                            side: THREE.DoubleSide,
                        });
                    }
                }
            });
            return model;
        }
        return null;
    }, [model, isPlayerAlive]);
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    if (child.material instanceof THREE.ShaderMaterial) {
                        child.material.uniforms.uTime.value += delta;
                    }
                }
            });
        }
    });
    if (Model) {
        return (
            <>
                <primitive
                    scale={[scale, scale, scale]}
                    ref={ref}
                    onClick={handleClick}
                    object={Model}
                    position={[position[0] + 0.2, position[1], position[2]]}
                    rotation={[
                        0,
                        position[2] > 1
                            ? Math.PI
                            : position[2] < -1
                              ? 0
                              : position[0] > 1
                                ? -Math.PI * 0.5
                                : Math.PI * 0.5,
                        0,
                    ]}
                />
            </>
        );
    } else {
        return null;
    }
};

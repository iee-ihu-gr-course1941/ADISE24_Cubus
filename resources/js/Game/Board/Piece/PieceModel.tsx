import {PIECE_GEOMETRY} from '@/Constants/geometries';
import {
    BOARD_PLACED_MATERIALS,
    BOARD_SELECTED_MATERIALS,
} from '@/Constants/materials';
import {useBoardState} from '@/Store/board_state';
import {PieceCode, Vector2} from '@/types/piece';
import {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import vertexShader from '../../../../shaders/piece/vertex.glsl';
import fragmentShader from '../../../../shaders/piece/fragment.glsl';
import {extend, useFrame} from '@react-three/fiber';
import {Float, shaderMaterial} from '@react-three/drei';
import {COLORS} from '@/Constants/colors';
import {lerp} from 'three/src/math/MathUtils.js';

const PieceMaterial = shaderMaterial(
    {
        uColor: new THREE.Color(0xff0000),
        uGlow: 1,
    },
    vertexShader,
    fragmentShader,
);

extend({PieceMaterial});

type Props = {
    block_positions: Vector2[];
    blockSize: number;
    pieceCode: PieceCode;
    isDragging: boolean;
    positionY: number;
    isHovering: boolean;
};

export const PieceModel = ({
    blockSize,
    block_positions,
    pieceCode,
    isDragging,
    positionY,
    isHovering,
}: Props) => {
    const blockRef = useRef<THREE.Mesh[]>([]);

    const playerIdentifier = useBoardState(
        state => state.playerState?.session_color,
    );
    const latestMove = useBoardState(state => state.move);

    useEffect(() => {
        //* Highlight latest move pieces

        if (playerIdentifier) {
        }
    }, [latestMove, playerIdentifier]);

    const addRef = (ref: THREE.Mesh | null, index: number) => {
        if (ref) {
            blockRef.current[index] = ref;
        }
    };

    return (
        <>
            {playerIdentifier &&
                block_positions.map((position, index) => {
                    return (
                        <mesh
                            ref={ref => addRef(ref, index)}
                            key={index}
                            position={[
                                position.x * blockSize,
                                positionY,
                                position.y * blockSize,
                            ]}
                            geometry={PIECE_GEOMETRY['block']}>
                            <PieceMaterialComponent
                                enableGlow={isHovering || isDragging}
                                color={COLORS[playerIdentifier]}
                            />
                        </mesh>
                    );
                })}
        </>
    );
};

type PieceMaterialProps = {
    color: number;
    enableGlow: boolean;
};
const PieceMaterialComponent = ({color, enableGlow}: PieceMaterialProps) => {
    const ref = useRef<THREE.ShaderMaterial>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.uniforms.uColor.value = new THREE.Color(color);
        }
    }, [color, ref]);
    useEffect(() => {
        if (!ref.current) return;

        if (enableGlow) {
            ref.current.uniforms.uGlow.value = 2.65;
        } else {
            ref.current.uniforms.uGlow.value = 1;
        }
    }, [enableGlow, ref]);

    return <pieceMaterial ref={ref} />;
};

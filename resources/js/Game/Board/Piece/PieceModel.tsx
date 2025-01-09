import {PIECE_GEOMETRY} from '@/Constants/geometries';
import {
    BOARD_PLACED_MATERIALS,
    BOARD_SELECTED_MATERIALS,
} from '@/Constants/materials';
import {useBoardState} from '@/Store/board_state';
import {PieceCode, Vector2} from '@/types/piece';
import {useEffect, useRef} from 'react';
import * as THREE from 'three';
import vertexShader from '../../../../shaders/piece/vertex.glsl';
import fragmentShader from '../../../../shaders/piece/fragment.glsl';
import {extend} from '@react-three/fiber';
import {shaderMaterial} from '@react-three/drei';
import {COLORS} from '@/Constants/colors';

const PieceMaterial = shaderMaterial(
    {
        uColor: new THREE.Color(0xff0000),
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
};

export const PieceModel = ({
    blockSize,
    block_positions,
    pieceCode,
    isDragging,
    positionY,
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
};
const PieceMaterialComponent = ({color}: PieceMaterialProps) => {
    const ref = useRef<THREE.ShaderMaterial>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.uniforms.uColor.value = new THREE.Color(color);
        }
    }, [color]);
    return <pieceMaterial ref={ref} />;
};

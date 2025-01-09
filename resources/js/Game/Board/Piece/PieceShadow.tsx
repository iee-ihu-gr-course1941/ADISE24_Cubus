import {useBoardState} from '@/Store/board_state';
import {PieceCode, Vector2} from '@/types/piece';
import {shaderMaterial} from '@react-three/drei';
import React, {
    ForwardedRef,
    MutableRefObject,
    Ref,
    useEffect,
    useRef,
} from 'react';
import * as THREE from 'three';
import vertexShader from '../../../../shaders/piece_shadow/vertexShader.glsl';
import fragmentShader from '../../../../shaders/piece_shadow/fragmentShader.glsl';
import {extend} from '@react-three/fiber';

const successColor = new THREE.Color(0x86efac);
const successColorLight = new THREE.Color(0xbbf7d0);
const errorColor = new THREE.Color(0xfca5a5);
const geometry = new THREE.BoxGeometry(0.5, 0.01, 0.5);

const BlockShadowMaterial = shaderMaterial(
    {
        uColor: new THREE.Color(0xff0000),
    },
    vertexShader,
    fragmentShader,
);

extend({BlockShadowMaterial});

type Props = {
    isDragging: boolean;
    block_positions: Vector2[];
    blockSize: number;
    shadowPosition?: THREE.Vector3;
    pieceCode: PieceCode;
};
export const PieceShadow = React.forwardRef<THREE.Group, Props>(
    (
        {
            isDragging,
            block_positions,
            blockSize,
            shadowPosition,
            pieceCode,
        }: Props,
        ref,
    ) => {
        const boardObject = useBoardState(state => state.boardRef);
        const shadowMaterialRef = useRef<THREE.ShaderMaterial[]>([]);
        const shadowObject = (
            ref as unknown as MutableRefObject<THREE.Group | undefined>
        ).current;
        const latestMove = useBoardState(state => state.move);

        useEffect(() => {
            //* Update position
            if (shadowObject && shadowPosition) {
                shadowObject.position.set(
                    shadowPosition.x,
                    0.1,
                    shadowPosition.z,
                );
            }
        }, [shadowPosition, ref]);

        useEffect(() => {
            //* Handle raycasting
            if (
                shadowObject &&
                boardObject &&
                shadowPosition &&
                shadowMaterialRef.current
            ) {
                const blocksInside = [];
                const blocksOutside = [];
                for (let i = 0; i < shadowObject.children.length; i++) {
                    const block = shadowObject.children[i];
                    const raycaster = new THREE.Raycaster();
                    const position = new THREE.Vector3();
                    block.getWorldPosition(position);
                    position.y = 0.1;

                    raycaster.set(
                        position,
                        new THREE.Vector3(0, -1, 0).normalize(),
                    );
                    const intersects = raycaster.intersectObject(boardObject);

                    if (intersects.length > 0) {
                        blocksInside.push({index: i, block});
                    } else {
                        blocksOutside.push({index: i, block});
                    }
                }
                for (let i = 0; i < blocksInside.length; i++) {
                    const {block, index} = blocksInside[i];
                    const material = shadowMaterialRef.current[index];
                    material.uniforms.uColor.value =
                        latestMove?.code === pieceCode
                            ? successColor
                            : successColorLight;
                    block.visible = true;
                }
                for (let i = 0; i < blocksOutside.length; i++) {
                    const {block, index} = blocksOutside[i];
                    const material = shadowMaterialRef.current[index];
                    material.uniforms.uColor.value = errorColor;
                    block.visible = blocksInside.length > 0;
                }
            }
        }, [
            ref,
            boardObject,
            shadowPosition,
            latestMove,
            pieceCode,
            shadowMaterialRef,
        ]);
        return (
            <group
                visible={isDragging}
                ref={
                    ref as Ref<THREE.Group<THREE.Object3DEventMap>> | undefined
                }>
                {block_positions.map((position, index) => {
                    return (
                        <mesh
                            visible={true}
                            key={index}
                            position={[
                                position.x * blockSize,
                                0.0,
                                position.y * blockSize,
                            ]}
                            geometry={geometry}>
                            <blockShadowMaterial
                                transparent
                                depthWrite={false}
                                ref={materialRef =>
                                    !shadowMaterialRef.current.some(
                                        m => m === materialRef,
                                    ) &&
                                    materialRef &&
                                    shadowMaterialRef.current.push(materialRef)
                                }
                            />
                        </mesh>
                    );
                })}
            </group>
        );
    },
);

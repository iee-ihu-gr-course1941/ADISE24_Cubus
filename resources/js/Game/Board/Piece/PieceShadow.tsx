import { useBoardState } from "@/Store/board_state";
import { Vector2 } from "@/types/piece";
import React, { ForwardedRef, MutableRefObject, Ref, useEffect, useRef } from "react";
import * as THREE from "three";

const materialSuccess = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const materialError = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const geometry = new THREE.BoxGeometry(0.5,0.01,0.5);

type Props = {
    isDragging: boolean;
    block_positions: Vector2[];
    blockSize: number;
    shadowPosition?: THREE.Vector3;
}
export const PieceShadow = React.forwardRef<THREE.Group, Props>(({isDragging, block_positions, blockSize, shadowPosition}: Props, ref) => {
    const boardObject = useBoardState(state => state.boardRef)
    const shadowObject = (ref as unknown as  MutableRefObject<THREE.Group | undefined>).current;
    useEffect(() => {
        //* Update position
        if(shadowObject && shadowPosition){
            shadowObject.position.set(shadowPosition.x, 0.05, shadowPosition.z);
        }
    }, [shadowPosition, ref])

    useEffect(() => {
        //* Handle raycasting
        if(shadowObject && boardObject && shadowPosition){
            const blocksInside = [];
            const blocksOutside = [];
            for (const block of shadowObject.children){
                const raycaster = new THREE.Raycaster();
                const position = new THREE.Vector3();
                block.getWorldPosition(position);
                position.y += 0.1;

                raycaster.set(position, new THREE.Vector3(0, -1, 0).normalize());
                const intersects = raycaster.intersectObject(boardObject);
                if(intersects.length > 0){
                    blocksInside.push(block);
                }else{
                    blocksOutside.push(block);
                }
            }

            for(const block of blocksInside as THREE.Mesh[]){
                block.material = materialSuccess;
                block.visible = true;
            }
            for (const block of blocksOutside as THREE.Mesh[]){
                block.visible = blocksInside.length > 0;
                if(blocksInside.length > 0){
                    block.material = materialError;
                }
            }

        }
    }, [ref, boardObject, shadowPosition])
    return (
        <group visible={isDragging} ref={ref as Ref<THREE.Group<THREE.Object3DEventMap>> | undefined}>
            {
                block_positions.map((position, index) => {
                    return (
                        <mesh visible={false} key={index} position={[position.x * blockSize, 0, position.y * blockSize]} geometry={geometry} material={materialSuccess} />
                    )
                })
            }
        </group>
    )
});

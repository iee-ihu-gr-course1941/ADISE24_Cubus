import { useBoardState } from "@/Store/board_state";
import { PieceCode, Vector2 } from "@/types/piece";
import { useEffect, useRef } from "react";
import * as THREE from 'three'

type Props = {
    block_positions: Vector2[];
    blockSize: number;
    pieceCode: PieceCode;
    isDragging: boolean;
}
const materialStrong = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const material = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
// const originMaterial = new THREE.MeshStandardMaterial({ color: 0xdd0a0a });
const geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
export const PieceModel = ({blockSize,block_positions, pieceCode,isDragging}: Props) => {
    const blockRef = useRef<THREE.Mesh[]>([]);

    const latestMove = useBoardState(state => state.move);

        useEffect(() => {

            //* Highlight latest move pieces

            blockRef.current.forEach((block, index) => {
                if(latestMove?.code === pieceCode){
                    block.material = materialStrong;
                }else if(block.material === materialStrong){
                    block.material = material;
                }
            })

    }, [latestMove])

    const addRef = (ref: THREE.Mesh | null, index: number) => {
        if(ref){
            blockRef.current[index] = ref;
        }
    }

    return (
        <>
           {
            block_positions.map((position, index) => {
                return (
                    <mesh ref={ref => addRef(ref, index)} key={index} position={[position.x * blockSize, 0, position.y * blockSize]} geometry={geometry} material={material} />
                )
            })
            }
        </>
    )

}

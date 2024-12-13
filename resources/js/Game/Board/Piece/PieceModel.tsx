import { Vector2 } from "@/types/piece";
import * as THREE from 'three'

type Props = {
    block_positions: Vector2[];
    blockSize: number;
}
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const originMaterial = new THREE.MeshStandardMaterial({ color: 0xaa0f0f });
const geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
export const PieceModel = ({blockSize,block_positions}: Props) => {

    return (
        <>
           {
            block_positions.map((position, index) => {
                return (
                    <mesh key={index} position={[position.x * blockSize, 0, position.y * blockSize]} geometry={geometry} material={index === 0 ? originMaterial : material} />
                )
            })
            }
        </>
    )

}

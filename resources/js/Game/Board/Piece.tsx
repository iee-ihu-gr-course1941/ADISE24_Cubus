import { PiecePositions, Piece as PieceData } from "@/Constants/Piece";
import { useGameDimensions } from "@/Store/game_dimensions";
import { PieceCode } from "@/types/piece";
import { DragControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const originMaterial = new THREE.MeshStandardMaterial({ color: 0xaa0f0f });
const geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
type Props = {
    pieceCode: PieceCode;
    position: [number, number, number];
}

export const Piece = ({pieceCode = 0, position}: Props) => {
    const blockSize = useGameDimensions(state => state.blockSize);
    const ref = useRef<THREE.Group>(null);
    const [centerCalculated, setCenterCalculated] = useState(false);

    const {block_positions,center_offset,origin_center_distance} = PieceData[pieceCode];

    useEffect(() => {

        if(ref.current){
            calculateCenter()
        }

    }, [ref.current, position, pieceCode])


    const calculateCenter = () => {
        if (ref.current && !centerCalculated) {
            //* Convert Origin's position to Piece's position
            const positionXoffset = (origin_center_distance.x * blockSize)/2;
            const positionYoffset = (origin_center_distance.y * blockSize)/2;
            const pMatrix = new THREE.Matrix4().makeTranslation(
                position[0] - positionXoffset,
                0.25,
                position[2] - positionYoffset
            );

            ref.current.applyMatrix4(pMatrix);
            ref.current.updateWorldMatrix(true, true);

            //* Calculate Bounding Box (Center of piece)
            const boundingBox = new THREE.Box3().setFromObject(ref.current);

            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            center.x -= center_offset.x * blockSize;
            center.z -= center_offset.y * blockSize;

            ref.current.children.forEach((child) => {
              if (child instanceof THREE.Mesh) {
                //* Move child based on positio matrix
                child.applyMatrix4(pMatrix);

                //* Move child to center
                child.position.sub(center);
                child.updateWorldMatrix(true, true);
              }
            });

            setCenterCalculated(true)
          }
    }

    const onDragEnd = () => {

        if(ref.current){
            //* The position of the center of the origin block
            const position = new THREE.Vector3();
            ref.current.children[0].getWorldPosition(position);
            console.log(position);
        }

    }


    const rotate = () => {
        if(ref.current){
            gsap.to(ref.current.rotation, {y: ref.current.rotation.y + Math.PI * 0.5, duration: 1});
        }
    }

    return (
        <DragControls axisLock="y" onDragEnd={onDragEnd}>
            <group  onContextMenu={rotate} ref={ref}>
            {
                block_positions.map((position, index) => {
                    return (
                        <mesh key={index} position={[position.x * blockSize, 0, position.y * blockSize]} geometry={geometry} material={index === 0 ? originMaterial : material} />
                    )
                })
            }
            </group>
        </DragControls>
    );
}

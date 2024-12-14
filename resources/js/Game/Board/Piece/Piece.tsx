import { PiecePositions, Piece as PieceData } from "@/Constants/Piece";
import { useGameDimensions } from "@/Store/game_dimensions";
import { MovePayload, MoveType, PieceCode, PieceRotation } from "@/types/piece";
import { DragControls } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ThreeEvent } from "@react-three/fiber";
import {useControls} from 'leva';
import { BoardState, useBoardState } from "@/Store/board_state";
import { PieceModel } from "./PieceModel";

type Props = MovePayload & {

}

const rotationToIndex = (rotation: number) => {
    const normalizedRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
    return (Math.round(normalizedRotation / (Math.PI / 2))) % 4 as PieceRotation;
  };

export const Piece = ({code: pieceCode = 0, origin_position: position, rotation, flip}: Props) => {
    const blockSize = useGameDimensions(state => state.blockSize);
    const ref = useRef<THREE.Group>(null);

    const [centerCalculated, setCenterCalculated] = useState(false);
    const [lockRotation, setLockRotation] = useState(false);
    const [prePosition, setPrePosition] = useState<THREE.Vector3 | null>(null);
    const [preQuaternion, setPreQuaternion] = useState<THREE.Quaternion | null>(null);
    const [preMovePosition, setPreMovePosition] = useState<THREE.Vector3 | null>(null);
    const [preMoveQuaternion, setPreMoveQuaternion] = useState<THREE.Quaternion | null>(null);
    const [hasMoved, setHasMoved] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const onStart = useRef<() => void>();
    const onComplete = useRef<(moveType: MoveType) => void>();
    const [boardState, setBoardState] = useState<BoardState>()

    const canMovePiece = useMemo(() => {
            return !lockRotation && boardState?.canPlay() && !boardState?.boardPieces.some(p => p.uuid === ref.current?.uuid);
    }, [lockRotation, boardState?.gameState, boardState?.boardPieces, ref.current]);

    const {isPositionValid, dragHeight, animationDuration} = useControls(
        {
            isPositionValid: {
                label: 'Valid Move',
                value: true,
            },
            dragHeight: {
                label: 'Drag Height',
                value: 1,
                min: 0.0,
                max: 2,
                step: 0.25,
            },
            animationDuration: {
                label: 'Animation Duration',
                value: 0.25,
                min: 0.0,
                max: 2,
                step: 0.1,
            }
        }
    )

    const {block_positions,center_offset,origin_center_distance} = PieceData[pieceCode];

    useEffect(() => {

        setBoardState(useBoardState.getState())
        //* We subscribe to the state instead of listening to it directly to avoid re-rendering before component's state is correctly updated
        const unsubscribe = useBoardState.subscribe(state => setBoardState(state))
        return () => {
            unsubscribe()
        }

    }, [])

    useEffect(() => {
        //* LISTENERS
        if(boardState?.gameState.state === 'OwnTurnPlaying'){
            setHasMoved(false);
            onMoveStart();
        }else if (boardState?.gameState.state === 'OwnTurnLocked'){
            if((boardState?.move?.code !== pieceCode || !isPiecePositionValid()) && hasMoved){
                    onMoveReject();
            }else if(isPositionValid && boardState?.move?.code === pieceCode && ref.current){
                boardState?.endTurn();
                boardState?.addBoardPiece(ref.current)
            }else if(hasMoved){
                onMoveReject();
            }
        }
    }, [boardState?.gameState.state])

    useEffect(() => {

        if(ref.current){
            positionElement()
        }

    }, [ref.current, position, pieceCode, rotation, flip])

    useEffect(() => {

        onStart.current = () => {
            if(ref.current){
                if(!preQuaternion){
                    const quaternion = new THREE.Quaternion();
                    ref.current.getWorldQuaternion(quaternion)
                    setPreQuaternion(quaternion);
                }
                setLockRotation(true)
            }
        }

        onComplete.current = (moveType: MoveType) => {
            if(ref.current){
                setLockRotation(false)
                setHasMoved(true);
                // if(!prePosition){
                onPositionChange(moveType, false);
                // }
            }
        }

    }, [ref.current, preQuaternion, isPositionValid, prePosition])

    const getOriginalQuaternion = () => {
        const flipAxis = getFlipAxis();
        return new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                (flipAxis === 'x' && flip) ? Math.PI : 0,
                rotation * (Math.PI * 0.5),
                (flipAxis === 'z' && flip) ? Math.PI : 0
            )
        );
    }

    const positionElement = () => {
        if (ref.current && !centerCalculated) {
            //* Convert Origin's position to Piece's position
            const piecePosition = new THREE.Vector3(position.x, blockSize * 0.5 + 0.01, position.y).sub(getOriginToCenterOffset());

            const rotationQuaternion = getOriginalQuaternion();

            const pMatrix = new THREE.Matrix4().makeTranslation(
                piecePosition.x,
                piecePosition.y,
                piecePosition.z
            )

            ref.current.applyMatrix4(pMatrix);
            ref.current.updateWorldMatrix(true, true);

            //* Calculate Bounding Box (Center of piece)
            const boundingBox = new THREE.Box3().setFromObject(ref.current);

            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            //* Apply center offset
            center.x -= center_offset.x * blockSize;
            center.z -= center_offset.y * blockSize;

            ref.current.children.forEach((child, i) => {
              if (child instanceof THREE.Mesh) {
                //* Move child based on position matrix
                child.applyMatrix4(pMatrix);

                //* Move child to center
                child.position.sub(center);
                child.updateWorldMatrix(true, true);
              }
            });

            //* Fix the position of the rotated/flipped piece
            //Get the position without the quaternion
            const prePosition = new THREE.Vector3();
            ref.current.children[0].getWorldPosition(prePosition);

            ref.current.applyQuaternion(rotationQuaternion);
            //Get the position with the quaternion
            const postPosition = new THREE.Vector3();
            ref.current.children[0].getWorldPosition(postPosition);

            const offset = new THREE.Vector3(postPosition.x - prePosition.x, 0, postPosition.z - prePosition.z);

            //* Subtract the offset from the position
            ref.current.position.sub(offset);

            ref.current.updateWorldMatrix(true, true);

            setCenterCalculated(true)
          }
    }

    const saveMove = () => {
        if(ref.current){
            //* The position of the center of the origin block
            const centerPosition = new THREE.Vector3();
            ref.current.children[0].getWorldPosition(centerPosition);

            const position = centerPosition.add(getOriginToCenterOffset());
            position.x = Math.round(position.x * 100) / 100;
            position.z = Math.round(position.z * 100) / 100;
            position.y = Math.round(position.y * 100) / 100;

            const isFlipped = isPieceFlipped('z') || isPieceFlipped('x');
            const rotationIndex = rotationToIndex(getRotationFromQuaternion().y);

            const payload: MovePayload = {
                code: pieceCode,
                origin_position: position,
                rotation: rotationIndex,
                flip: isFlipped,
            }
            // console.log('payload:', payload);
            boardState?.setMove(payload);
        }
    }

    const onMoveStart = () => {
        if(ref.current){
            const quaternion = new THREE.Quaternion();
            ref.current.getWorldQuaternion(quaternion);

            setPreMovePosition(getPiecePosition());
            setPreMoveQuaternion(quaternion);
        }
    }

    const isPiecePositionValid = () => {
        return (isPieceOnBoard() && !isPieceInteractingWithOtherPieces());
    }

    const onPositionChange = (moveType: MoveType, rejectChange = true) => {
        //* Local Movement
        const isPositionValid = isPiecePositionValid();
        if(!isPositionValid && rejectChange){
            onPositionChangeReject(moveType);
        }else if(ref.current && isPositionValid){
            saveMove();
        }
    }

    const getRotationFromQuaternion = () => {
        if(ref.current){
            const quaternion = new THREE.Quaternion();
            ref.current.getWorldQuaternion(quaternion);
            const rotation = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');
            return rotation;
        }else{
            return new THREE.Euler();
        }
    }

    const getOriginToCenterOffset = () => {
        return new THREE.Vector3(origin_center_distance.x * blockSize, 0, origin_center_distance.y * blockSize);
    }

    const getPiecePosition = () => {
        if(ref.current){
            const position = new THREE.Vector3();
            ref.current.children[0].getWorldPosition(position);
            position.sub(getOriginToCenterOffset());
            return position;
        }
        return new THREE.Vector3();
    }

    const snapPieceToGrid = () => {
        if(ref.current){
            const currentPosition = getPiecePosition();
            const snapX = Math.round(currentPosition.x / blockSize) * blockSize;
            const snapZ = Math.round(currentPosition.z / blockSize) * blockSize;

            const translation = new THREE.Vector3(snapX, currentPosition.y, snapZ).sub(currentPosition);

            const snapMatrix = new THREE.Matrix4().compose(
                new THREE.Vector3(translation.x, 0, translation.z),
                new THREE.Quaternion(),
                new THREE.Vector3(1,1,1)
            );

            ref.current.applyMatrix4(snapMatrix);
            ref.current.updateWorldMatrix(true, true);
        }
    }

    const rejectPosition = (type: 'lock' | 'change') => {
        if(ref.current){
            const currentPosition = getPiecePosition();
            const _prePosition = (type==='lock' ? preMovePosition : prePosition) ?? new THREE.Vector3();
            const translation = new THREE.Vector3(_prePosition.x - currentPosition.x, 0, _prePosition.z - currentPosition.z);
            if(translation.length() === 0) return;

            ref.current.applyMatrix4(new THREE.Matrix4().makeTranslation(translation.x, 0, translation.z));
            ref.current.updateWorldMatrix(true, true);
        }
    }

    const rejectRotation = (type: 'lock' | 'change') => {
        if(ref.current){
            const currentQuaternion = new THREE.Quaternion();
            ref.current.getWorldQuaternion(currentQuaternion);
            const rotationQuaternion = getOriginalQuaternion();

            //* Subtract the previous rotation from the current rotation
            ref.current.applyQuaternion(
                (((type==='lock' ? preMoveQuaternion : preQuaternion) ?? new THREE.Quaternion()).clone()
                .multiply(currentQuaternion.clone().invert())
                .multiply(rotationQuaternion).normalize()).normalize()
            );

            //* Fix any snapping issues
            const euler = new THREE.Euler().setFromQuaternion(ref.current.quaternion);
            const snappedEuler = new THREE.Euler(
                Math.round(euler.x / (Math.PI * 0.5)) * (Math.PI * 0.5),
                Math.round(euler.y / (Math.PI * 0.5)) * (Math.PI * 0.5),
                Math.round(euler.z / (Math.PI * 0.5)) * (Math.PI * 0.5)
            );
            ref.current.quaternion.setFromEuler(snappedEuler);
            ref.current.updateWorldMatrix(true, true);
        }
    }

    const onMoveReject = () => {
        if(preMoveQuaternion){
            rejectRotation('lock');
            setPreMoveQuaternion(null);
        }
        if(preMovePosition){
            rejectPosition('lock');
            setPreMovePosition(null);
        }
        if(ref.current){
            //* Remove piece in case of it not being in the board previously
            boardState?.removeBoardPiece(ref.current);
        }
        boardState?.rejectMove();
        boardState?.continueTurn();
    }

    const onPositionChangeReject = (moveType: MoveType) => {
            if(!ref.current) return;
            if(moveType === 'move'){
                rejectPosition('change');
                setPrePosition(null);
            }
            else if(moveType === 'rotate' || moveType === 'flip'){
                rejectRotation('change');
                setPreQuaternion(null);
            }
    }

    const onDragStart = () => {
        setIsDragging(true);
        addDragAnimation();
        setHasMoved(true);
        setPrePosition(getPiecePosition());
    }

    const onDragEnd = () => {
        setIsDragging(false);
        if(prePosition){
            snapPieceToGrid()
            onPositionChange('move');
        }
        removeDragAnimation();
    }

    const getFlipAxis = () => {
        if(ref.current){
            const indexedRotation = rotationToIndex(ref.current.rotation.y);
            if(indexedRotation === 0 || indexedRotation === 2){
                return 'z'
            }
        }
        return 'x';
    }

    const onRotate = () => {
        if(ref.current && canMovePiece){
            const sign = isPieceFlipped('z') ? -1 : 1;
            gsap.to(ref.current.rotation,
                {
                    y: ref.current.rotation.y + (Math.PI * 0.5) * (sign),
                    duration: 1,
                    onStart: onStart.current,
                    onComplete: () => onComplete.current?.('rotate'),
                },
            );
        }
    }

    const isPieceFlipped = (axis: 'x' | 'z') => {
        if(ref.current){
            return (Math.abs(ref.current.rotation[axis]) >= Math.round(Math.PI));
        }else{
            return false;
        }
    }

    const onFlip = (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        if(ref.current && canMovePiece){
            const axis = getFlipAxis();
            const sign = ref.current.rotation[axis] < 0 ? -1 : 1 //* Fix problem being caused by the snapToGrid matrix which messes with the rotation sign
            gsap.to(ref.current.rotation,
            {
                [axis]: (isPieceFlipped(axis) ? ref.current.rotation[axis] - (Math.PI * sign) : ref.current.rotation[axis] + (Math.PI * sign)),
                duration: 1,
                onStart: onStart.current,
                onComplete: () => onComplete.current?.('flip'),
            }
            ,);
        }
    }
    const isPieceOnBoard = () => {
        const board = boardState?.boardRef;
        if(ref.current && board){
            for(const child of ref.current.children){
                const raycaster = new THREE.Raycaster();
                const position = new THREE.Vector3();
                child.getWorldPosition(position);

                raycaster.set(position, new THREE.Vector3(0, -1, 0).normalize());
                const intersects = raycaster.intersectObject(board);
                if(intersects.length === 0){
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    const isPieceInteractingWithOtherPieces = () => {
        const piece = ref.current;
        if(piece){
            const pieces = boardState?.boardPieces.filter(item => item.uuid !== piece.uuid) ?? []
            //* Check if there are no other pieces
            if(pieces.length === 0) {
                return false;
            }else{
                //* Get all the pieces positions that are on board;
                const piecesPosition = pieces.map((p) => p.children.map(_ => new THREE.Vector3())).flat();
                pieces.forEach((p, i) => p.children.forEach((b, j) => b.getWorldPosition(piecesPosition[i * piece.children.length + j])));
                //* Traverse through all blocks to find if any pieces are on top of each other
                for(const block of piece.children){
                    const blockPosition = new THREE.Vector3();
                    block.getWorldPosition(blockPosition);
                    //* Calculate all the distances between the piece's block and all the other pieces blocks but exclude "y" axis to avoid confusion with height/drag animation
                    const minDistance = Math.min(...piecesPosition.map(p => (new THREE.Vector3(blockPosition.x, 0, blockPosition.z)).distanceTo(new THREE.Vector3(p.x, 0, p.z))));
                    const allowedDistance = blockSize * 0.5;
                    if((allowedDistance >= (minDistance)) ){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const addDragAnimation = () => {
        if(ref.current){
            gsap.to(ref.current.position, {y: dragHeight * blockSize, duration: animationDuration * 2, ease: 'power1.inOut'});
        }
    }

    const removeDragAnimation = () => {
        if(ref.current){
            gsap.to(ref.current.position, {y: blockSize*0.5, duration: animationDuration, ease: 'power1.inOut'});
        }
    }


    return (
        <>
            <DragControls axisLock="y"  onDragEnd={onDragEnd} onDragStart={onDragStart} dragConfig={{enabled: canMovePiece}}>
                <group onDoubleClick={onFlip} onContextMenu={onRotate} ref={ref}>
                    <PieceModel block_positions={block_positions} blockSize={blockSize}/>
                </group>
            </DragControls>
        </>
    );
}

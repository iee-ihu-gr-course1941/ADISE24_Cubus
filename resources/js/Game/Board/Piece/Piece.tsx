import {PiecePositions, Piece as PieceData} from '@/Constants/Piece';
import {useGameDimensions} from '@/Store/game_dimensions';
import {MoveType, PieceCode, PieceRotation} from '@/types/piece';
import {DragControls} from '@react-three/drei';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import {ThreeEvent} from '@react-three/fiber';
import {useControls} from 'leva';
import {BoardState, useBoardState} from '@/Store/board_state';
import {PieceModel} from './PieceModel';
import {PieceShadow} from './PieceShadow';
import {useInterfaceState} from '@/Store/interface_state';
import {MovePayload} from '@/types/game';
import {validateMove} from '@/network/session_network';

type Props = MovePayload & {};

const rotationToIndex = (rotation: number) => {
    const normalizedRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
    return (Math.round(normalizedRotation / (Math.PI / 2)) %
        4) as PieceRotation;
};

export const Piece = ({
    code: pieceCode = 0,
    origin_x,
    origin_y,
    rotation,
    flip,
}: Props) => {
    const blockSize = useGameDimensions(state => state.blockSize);
    const ref = useRef<THREE.Group>(null);
    const shadowRef = useRef<THREE.Group>(null);

    const position = useMemo(() => {
        return {
            x: origin_x,
            y: origin_y,
        };
    }, [origin_x, origin_y]);

    const [centerCalculated, setCenterCalculated] = useState(false);
    const [lockRotation, setLockRotation] = useState(false);
    const [prePosition, setPrePosition] = useState<THREE.Vector3 | null>(null);
    const [preQuaternion, setPreQuaternion] = useState<THREE.Quaternion | null>(
        null,
    );
    const [preMovePosition, setPreMovePosition] =
        useState<THREE.Vector3 | null>(null);
    const [preMoveQuaternion, setPreMoveQuaternion] =
        useState<THREE.Quaternion | null>(null);
    const [hasMoved, setHasMoved] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [shadowPosition, setShadowPosition] = useState<THREE.Vector3>();
    const onStart = useRef<() => void>();
    const onComplete = useRef<(moveType: MoveType) => void>();
    const onDragAnimationEnd = useRef<() => void>();
    const [boardState, setBoardState] = useState<BoardState>();
    const {action, setAction} = useInterfaceState();

    const canMovePiece = useMemo(() => {
        return (
            !lockRotation &&
            boardState?.canPlay() &&
            !boardState?.boardPieces.some(p => p.uuid === ref.current?.uuid)
        );
    }, [
        lockRotation,
        boardState?.gameState,
        boardState?.boardPieces,
        ref.current,
    ]);

    const {isPositionValid, dragHeight, animationDuration} = useControls({
        isPositionValid: {
            label: 'Valid Move',
            value: true,
        },
        dragHeight: {
            label: 'Drag Height',
            value: 1.5,
            min: 0.0,
            max: 3,
            step: 0.25,
        },
        animationDuration: {
            label: 'Animation Duration',
            value: 0.25,
            min: 0.0,
            max: 2,
            step: 0.1,
        },
    });

    const {block_positions, center_offset, origin_center_distance} =
        PieceData[pieceCode];

    useEffect(() => {
        //* Listen to Action events

        if (boardState?.move?.code !== pieceCode) {
            return;
        }

        if (action === 'rotate_pos') {
            onRotate('pos');
        } else if (action === 'rotate_neg') {
            onRotate('neg');
        } else if (action === 'flip') {
            onFlip();
        }
    }, [action]);

    useEffect(() => {
        setBoardState(useBoardState.getState());
        //* We subscribe to the state instead of listening to it directly to avoid re-rendering before component's state is correctly updated
        const unsubscribe = useBoardState.subscribe(state =>
            setBoardState(state),
        );
        return () => {
            unsubscribe();
        };
    }, []);

    if (pieceCode === 0) {
        console.log(boardState?.gameState.ui_state);
    }

    useEffect(() => {
        //* LISTENERS
        if (boardState?.gameState.ui_state === 'OwnTurnPlaying') {
            setHasMoved(false);
            onMoveStart();
        } else if (boardState?.gameState.ui_state === 'OwnTurnLocked') {
            onLockIn();
        }
    }, [boardState?.gameState.ui_state]);

    const onLockIn = (onComplete = true) => {
        if (ref.current) {
            gsap.to(ref.current.position, {
                y: blockSize * 0.5,
                duration: animationDuration,
                onComplete: onComplete ? onDragAnimationEnd.current : undefined,
            });
        }
    };

    useEffect(() => {
        if (ref.current) {
            positionElement();
        }
    }, [ref.current, position, pieceCode, rotation, flip]);

    useEffect(() => {
        onStart.current = () => {
            if (ref.current) {
                setIsDragging(false);
                if (!preQuaternion) {
                    const quaternion = new THREE.Quaternion();
                    ref.current.getWorldQuaternion(quaternion);
                    setPreQuaternion(quaternion);
                }
                setLockRotation(true);
            }
        };

        onComplete.current = (moveType: MoveType) => {
            if (ref.current) {
                setIsDragging(true);
                setLockRotation(false);
                setHasMoved(true);
                onPositionChange(moveType, false);
            }

            //* Reset action
            if (action !== 'none') {
                setAction('none');
            }
        };
    }, [ref.current, preQuaternion, isPositionValid, prePosition, action]);

    useEffect(() => {
        onDragAnimationEnd.current = async () => {
            let isValid = false;
            console.log(hasMoved);
            if (
                boardState &&
                boardState.move &&
                boardState?.move?.code === pieceCode
            ) {
                const moveResponse = await validateMove({
                    ...boardState.move,
                    origin_x: (boardState.move.origin_x + 5 - 0.5) * 2,
                    origin_y: (boardState.move.origin_y + 5 - 0.5) * 2,
                });
                console.log('move response:', moveResponse);
                isValid = moveResponse?.valid ?? false;
            }
            if (
                (!isPiecePositionValid() ||
                    boardState?.move?.code !== pieceCode) &&
                hasMoved
            ) {
                onMoveReject();
            } else if (
                isValid &&
                boardState?.move?.code === pieceCode &&
                ref.current
            ) {
                boardState?.addBoardPiece(ref.current);
                boardState?.endTurn();
            } else if (hasMoved) {
                console.log('rejecting', pieceCode);
                onMoveReject();
            }
            setIsDragging(false);
        };
    }, [boardState?.move, pieceCode, hasMoved, ref.current, isPositionValid]);

    const getOriginalQuaternion = () => {
        const flipAxis = getFlipAxis();
        return new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                flipAxis === 'x' && flip ? Math.PI : 0,
                rotation * (Math.PI * 0.5),
                flipAxis === 'z' && flip ? Math.PI : 0,
            ),
        );
    };

    const positionElement = () => {
        if (ref.current && !centerCalculated) {
            //* Convert Origin's position to Piece's position
            const piecePosition = new THREE.Vector3(
                position.x,
                blockSize * 0.5 + 0.01,
                position.y,
            ).sub(getOriginToCenterOffset());

            const rotationQuaternion = getOriginalQuaternion();

            const pMatrix = new THREE.Matrix4().makeTranslation(
                piecePosition.x,
                piecePosition.y,
                piecePosition.z,
            );

            ref.current.applyMatrix4(pMatrix);
            shadowRef.current?.applyMatrix4(pMatrix);
            shadowRef.current?.updateWorldMatrix(true, true);
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
                    shadowRef.current?.children[i].applyMatrix4(pMatrix);

                    //* Move child to center
                    child.position.sub(center);
                    shadowRef.current?.children[i].position.sub(center);
                    child.updateWorldMatrix(true, true);
                    shadowRef.current?.children[i].updateWorldMatrix(
                        true,
                        true,
                    );
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

            const offset = new THREE.Vector3(
                postPosition.x - prePosition.x,
                0,
                postPosition.z - prePosition.z,
            );

            //* Subtract the offset from the position
            ref.current.position.sub(offset);

            ref.current.updateWorldMatrix(true, true);

            setCenterCalculated(true);
        }
    };

    const saveMove = () => {
        if (ref.current) {
            //* The position of the center of the origin block
            const centerPosition = new THREE.Vector3();
            ref.current.children[0].getWorldPosition(centerPosition);

            const position = centerPosition.add(getOriginToCenterOffset());
            position.x = Math.round(position.x * 100) / 100;
            position.z = Math.round(position.z * 100) / 100;
            position.y = Math.round(position.y * 100) / 100;

            const isFlipped = isPieceFlipped('z') || isPieceFlipped('x');
            const rotation = getRotationFromQuaternion();
            const rotationIndex = rotationToIndex(rotation.y);

            const payload: MovePayload = {
                code: pieceCode,
                origin_x: position.x,
                origin_y: position.z,
                rotation: rotationIndex,
                flip: isFlipped,
            };
            // console.log('payload:', payload);
            boardState?.setMove(payload);
        }
    };

    const onMoveStart = () => {
        if (ref.current) {
            const quaternion = new THREE.Quaternion();
            ref.current.getWorldQuaternion(quaternion);

            setPreMovePosition(getPiecePosition());
            setPreMoveQuaternion(quaternion);
        }
    };

    const isPiecePositionValid = () => {
        return isPieceOnBoard() && !isPieceInteractingWithOtherPieces();
    };

    const onPositionChange = (moveType: MoveType, rejectChange = true) => {
        //* Local Movement
        const isPieceInteracting = isPieceInteractingWithOtherPieces();
        const pieceOnBoard = isPieceOnBoard();
        if (moveType === 'flip' || moveType === 'rotate') {
            const rotation = getRotationFromQuaternion();
            shadowRef.current?.rotation.set(rotation.x, rotation.y, rotation.z);
        }
        if ((isPieceInteracting || !pieceOnBoard) && rejectChange) {
            if (!isPieceInteracting && !pieceOnBoard && moveType === 'move') {
                // //* Reject the move if the piece is not on the board
                rejectPosition('lock', dragHeight);
                if (pieceCode === boardState?.move?.code) {
                    boardState?.rejectMove();
                    boardState?.lockTurn();
                }
            } else {
                onPositionChangeReject(moveType);
            }
        } else if (ref.current && isPositionValid) {
            saveMove();
        }
    };

    const getRotationFromQuaternion = () => {
        if (ref.current) {
            const quaternion = new THREE.Quaternion();
            ref.current.getWorldQuaternion(quaternion);
            const rotation = new THREE.Euler().setFromQuaternion(
                quaternion,
                'YXZ',
            );
            return rotation;
        } else {
            return new THREE.Euler();
        }
    };

    const getOriginToCenterOffset = () => {
        return new THREE.Vector3(
            origin_center_distance.x * blockSize,
            0,
            origin_center_distance.y * blockSize,
        );
    };

    const getPiecePosition = () => {
        if (ref.current) {
            const position = new THREE.Vector3();
            ref.current.children[0].getWorldPosition(position);
            position.sub(getOriginToCenterOffset());
            return position;
        }
        return new THREE.Vector3();
    };

    const snapPieceToGrid = () => {
        if (ref.current) {
            const currentPosition = getPiecePosition();
            const snapX = Math.round(currentPosition.x / blockSize) * blockSize;
            const snapZ = Math.round(currentPosition.z / blockSize) * blockSize;

            const translation = new THREE.Vector3(
                snapX,
                currentPosition.y,
                snapZ,
            ).sub(currentPosition);

            const snapMatrix = new THREE.Matrix4().compose(
                new THREE.Vector3(translation.x, 0, translation.z),
                new THREE.Quaternion(),
                new THREE.Vector3(1, 1, 1),
            );

            ref.current.applyMatrix4(snapMatrix);
            ref.current.updateWorldMatrix(true, true);
        }
    };

    const rejectPosition = (type: 'lock' | 'change', y = 0) => {
        if (ref.current) {
            const currentPosition = getPiecePosition();
            const _prePosition =
                (type === 'lock' ? preMovePosition : prePosition) ??
                new THREE.Vector3();
            const translation = new THREE.Vector3(
                _prePosition.x - currentPosition.x,
                0,
                _prePosition.z - currentPosition.z,
            );
            if (translation.length() === 0) return;

            ref.current.applyMatrix4(
                new THREE.Matrix4().makeTranslation(
                    translation.x,
                    -0.5,
                    translation.z,
                ),
            );
            ref.current.updateWorldMatrix(true, true);

            const newPosition = new THREE.Vector3();
            ref.current.getWorldPosition(newPosition);
            setShadowPosition(newPosition);
        }
    };

    const rejectRotation = (type: 'lock' | 'change') => {
        if (ref.current) {
            const currentQuaternion = new THREE.Quaternion();
            ref.current.getWorldQuaternion(currentQuaternion);
            const rotationQuaternion = getOriginalQuaternion();

            //* Subtract the previous rotation from the current rotation
            ref.current.applyQuaternion(
                (
                    (type === 'lock' ? preMoveQuaternion : preQuaternion) ??
                    new THREE.Quaternion()
                )
                    .clone()
                    .multiply(currentQuaternion.clone().invert())
                    .multiply(rotationQuaternion)
                    .normalize()
                    .normalize(),
            );

            //* Fix any snapping issues
            const euler = new THREE.Euler().setFromQuaternion(
                ref.current.quaternion,
            );
            const snappedEuler = new THREE.Euler(
                Math.round(euler.x / (Math.PI * 0.5)) * (Math.PI * 0.5),
                Math.round(euler.y / (Math.PI * 0.5)) * (Math.PI * 0.5),
                Math.round(euler.z / (Math.PI * 0.5)) * (Math.PI * 0.5),
            );
            ref.current.quaternion.setFromEuler(snappedEuler);
            ref.current.updateWorldMatrix(true, true);
        }
    };

    const onMoveReject = () => {
        if (preMoveQuaternion) {
            rejectRotation('lock');
            setPreMoveQuaternion(null);
        }
        if (preMovePosition) {
            rejectPosition('lock');
            setPreMovePosition(null);
        }
        if (ref.current) {
            //* Remove piece in case of it not being in the board previously
            boardState?.removeBoardPiece(ref.current);
        }
        boardState?.rejectMove();
        if (boardState?.move?.code === pieceCode) {
            boardState?.continueTurn();
        }
    };

    const onPositionChangeReject = (moveType: MoveType) => {
        if (!ref.current) return;
        if (moveType === 'move') {
            rejectPosition('change');
            setPrePosition(null);
        } else if (moveType === 'rotate' || moveType === 'flip') {
            rejectRotation('change');
            setPreQuaternion(null);
        }
    };

    const onDragStart = () => {
        setIsDragging(true);
        addDragAnimation();
        setHasMoved(true);
        setPrePosition(getPiecePosition());
    };

    const onDragEnd = () => {
        if (prePosition && hasMoved) {
            snapPieceToGrid();
            onPositionChange('move');
        }
    };

    const getFlipAxis = () => {
        if (ref.current) {
            const indexedRotation = rotationToIndex(ref.current.rotation.y);
            if (indexedRotation === 0 || indexedRotation === 2) {
                return 'z';
            }
        }
        return 'x';
    };

    const onRotate = (direction: 'pos' | 'neg' = 'pos') => {
        if (ref.current && canMovePiece) {
            const sign =
                (isPieceFlipped('z') ? -1 : 1) * (direction == 'pos' ? 1 : -1);
            gsap.to(ref.current.rotation, {
                y: ref.current.rotation.y + Math.PI * 0.5 * sign,
                duration: animationDuration * 2.5,
                onStart: onStart.current,
                onComplete: () => onComplete.current?.('rotate'),
            });
        }
    };

    const isPieceFlipped = (axis: 'x' | 'z') => {
        if (ref.current) {
            return Math.abs(ref.current.rotation[axis]) >= Math.round(Math.PI);
        } else {
            return false;
        }
    };

    const onFlip = (event?: ThreeEvent<MouseEvent>) => {
        event?.stopPropagation();
        if (ref.current && canMovePiece) {
            const axis = getFlipAxis();
            const sign = ref.current.rotation[axis] < 0 ? -1 : 1; //* Fix problem being caused by the snapToGrid matrix which messes with the rotation sign
            gsap.to(ref.current.rotation, {
                [axis]: isPieceFlipped(axis)
                    ? ref.current.rotation[axis] - Math.PI * sign
                    : ref.current.rotation[axis] + Math.PI * sign,
                duration: animationDuration * 2.5,
                onStart: onStart.current,
                onComplete: () => onComplete.current?.('flip'),
            });
        }
    };
    const isPieceOnBoard = () => {
        const board = boardState?.boardRef;
        if (ref.current && board) {
            for (const child of ref.current.children) {
                const raycaster = new THREE.Raycaster();
                const position = new THREE.Vector3();
                child.getWorldPosition(position);

                raycaster.set(
                    position,
                    new THREE.Vector3(0, -1, 0).normalize(),
                );
                const intersects = raycaster.intersectObject(board);
                if (intersects.length === 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    const isPieceInteractingWithOtherPieces = () => {
        const piece = ref.current;
        if (piece) {
            const pieces =
                boardState?.boardPieces.filter(
                    item => item.uuid !== piece.uuid,
                ) ?? [];
            //* Check if there are no other pieces
            if (pieces.length === 0) {
                return false;
            } else {
                //* Get all the pieces positions that are on board;
                const piecesPosition = pieces
                    .map(p => p.children.map(_ => new THREE.Vector3()))
                    .flat();
                let totalBlocks = 0;
                for (let i = 0; i < pieces.length; i++) {
                    const refPiece = pieces[i];
                    for (let j = 0; j < refPiece.children.length; j++) {
                        refPiece.children[j].getWorldPosition(
                            piecesPosition[totalBlocks] ?? new THREE.Vector3(),
                        );
                        totalBlocks++;
                    }
                }
                //* Traverse through all blocks to find if any pieces are on top of each other
                for (const block of piece.children) {
                    const blockPosition = new THREE.Vector3();
                    block.getWorldPosition(blockPosition);
                    //* Calculate all the distances between the piece's block and all the other pieces blocks but exclude "y" axis to avoid confusion with height/drag animation
                    const minDistance = Math.min(
                        ...piecesPosition.map(p =>
                            new THREE.Vector3(
                                blockPosition.x,
                                0,
                                blockPosition.z,
                            ).distanceTo(new THREE.Vector3(p.x, 0, p.z)),
                        ),
                    );
                    const allowedDistance = blockSize * 0.5;
                    if (allowedDistance >= minDistance) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const addDragAnimation = () => {
        if (ref.current) {
            gsap.to(ref.current.position, {
                y: dragHeight * blockSize,
                duration: animationDuration * 2,
                ease: 'power1.inOut',
            });
        }
    };

    const onDrag = () => {
        //* Snap the shadow to the grid

        //Handle rotation
        const rotation = getRotationFromQuaternion();
        shadowRef.current?.rotation.set(rotation.x, rotation.y, rotation.z);

        //Handle position
        // Get center position
        const position = new THREE.Vector3();
        ref.current?.getWorldPosition(position);
        // Get a corner position
        const offset = new THREE.Vector3(blockSize * 0.5, 0, blockSize * 0.5);
        position.sub(offset);

        const snapX = Math.round(position.x / blockSize) * blockSize;
        const snapZ = Math.round(position.z / blockSize) * blockSize;

        const snapPosition = new THREE.Vector3(snapX, 0.05, snapZ).add(offset);
        setShadowPosition(snapPosition);
    };

    return (
        <>
            <DragControls
                axisLock="y"
                onDrag={onDrag}
                onDragEnd={onDragEnd}
                onDragStart={onDragStart}
                dragConfig={{enabled: canMovePiece, filterTaps: true}}>
                <group
                    onDoubleClick={() => setAction('flip')}
                    onContextMenu={() => setAction('rotate_pos')}
                    ref={ref}>
                    <PieceModel
                        isDragging={isDragging}
                        pieceCode={pieceCode}
                        block_positions={block_positions}
                        blockSize={blockSize}
                    />
                </group>
            </DragControls>
            <PieceShadow
                isDragging={isDragging}
                pieceCode={pieceCode}
                shadowPosition={shadowPosition}
                ref={shadowRef}
                block_positions={block_positions}
                blockSize={blockSize}
            />
        </>
    );
};

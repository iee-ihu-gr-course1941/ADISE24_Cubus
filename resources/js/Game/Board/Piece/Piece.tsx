import {PiecePositions, Piece as PieceData} from '@/Constants/Piece';
import {useGameDimensions} from '@/Store/game_dimensions';
import {MoveType, PieceCode, PieceRotation} from '@/types/piece';
import {DragControls, Float} from '@react-three/drei';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import {ThreeEvent} from '@react-three/fiber';
import {BoardState, useBoardState} from '@/Store/board_state';
import {PieceModel} from './PieceModel';
import {PieceShadow} from './PieceShadow';
import {useInterfaceState} from '@/Store/interface_state';
import {MovePayload} from '@/types/game';
import {validateMove} from '@/network/session_network';
import {formatMoveOrigin} from '@/libs/move';

type Props = MovePayload & {
    positionY: number;
};

const rotationToIndex = (rotation: number) => {
    const normalizedRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
    return (Math.round(normalizedRotation / (Math.PI / 2)) %
        4) as PieceRotation;
};
type AnimateState = 'lowering' | 'increasing' | null;

const animationDuration = 0.2;

export const Piece = ({
    code: pieceCode = 0,
    origin_x,
    origin_y,
    positionY,
    rotation,
    flip,
}: Props) => {
    const blockSize = useGameDimensions(state => state.blockSize);
    const ref = useRef<THREE.Group>(null);
    const shadowRef = useRef<THREE.Group>(null);

    const playerCount = useBoardState(state => state.gameState.player_count);

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
    const pieceAnimationState = useRef<AnimateState>(null);
    const [isHovering, setIsHovering] = useState(false);

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
                y: pieceCode === boardState?.move?.code ? 0.2 : positionY,
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
    }, [ref.current, preQuaternion, prePosition, action]);

    useEffect(() => {
        onDragAnimationEnd.current = async () => {
            let isValid = false;
            if (
                boardState &&
                boardState.move &&
                boardState?.move?.code === pieceCode
            ) {
                console.log(boardState.move);
                const moveResponse = await validateMove(
                    formatMoveOrigin(boardState.move, playerCount),
                );
                console.log('move response:', moveResponse);
                isValid = moveResponse?.valid ?? false;
                // isValid = true;
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
                onMoveReject();
            }
            setIsDragging(false);
        };
    }, [boardState?.move, pieceCode, hasMoved, ref.current]);

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
                positionY,
                position.y,
            ).sub(getOriginToCenterOffset());

            const rotationQuaternion = getOriginalQuaternion();

            const pMatrix = new THREE.Matrix4().makeTranslation(
                piecePosition.x,
                piecePosition.y,
                piecePosition.z,
            );

            const pMatrixNoHeight = new THREE.Matrix4().makeTranslation(
                piecePosition.x,
                0,
                piecePosition.z,
            );

            ref.current.applyMatrix4(pMatrix);
            shadowRef.current?.applyMatrix4(pMatrixNoHeight);
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
                    shadowRef.current?.children[i].applyMatrix4(
                        pMatrixNoHeight,
                    );

                    //* Move child to center
                    child.position.sub(center);
                    shadowRef.current?.children[i].position.sub(
                        new THREE.Vector3(center.x, 0, center.z),
                    );
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

            // const position = centerPosition.add(getOriginToCenterOffset());
            const position = centerPosition;
            position.x = Math.round(position.x * 100) / 100;
            position.z = Math.round(position.z * 100) / 100;
            position.y = Math.round(position.y * 100) / 100;

            const rotation = getRotationFromQuaternion();
            const rotationIndex = rotationToIndex(rotation.y);

            const isFlipped =
                Math.abs(rotation['z']) >= Math.round(Math.PI) ||
                Math.abs(rotation['x']) >= Math.round(Math.PI);

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
        const pieceTouchingBoard = isPieceTouchingBoard();
        if (moveType === 'flip' || moveType === 'rotate') {
            const rotation = getRotationFromQuaternion();
            shadowRef.current?.rotation.set(rotation.x, rotation.y, rotation.z);
        }
        if ((isPieceInteracting || !pieceOnBoard) && rejectChange) {
            if (
                !isPieceInteracting &&
                moveType === 'move' &&
                !pieceTouchingBoard
            ) {
                // //* Reject the move if the piece is not on the board
                rejectPosition('lock');
                if (pieceCode === boardState?.move?.code) {
                    //! Deprecated feature
                    // boardState?.rejectMove();
                    // boardState?.lockTurn();
                }
            } else {
                saveMove();
                //! Deprecated feature
                // onPositionChangeReject(moveType);
            }
        } else if (ref.current) {
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

    const rejectPosition = (type: 'lock' | 'change') => {
        if (ref.current) {
            const currentPosition = getPiecePosition();
            const _prePosition =
                (type === 'lock' ? preMovePosition : prePosition) ??
                new THREE.Vector3();
            const translation = new THREE.Vector3(
                _prePosition.x - currentPosition.x,
                _prePosition.y - currentPosition.y,
                _prePosition.z - currentPosition.z,
            );
            if (translation.length() === 0) return;

            ref.current.applyMatrix4(
                new THREE.Matrix4().makeTranslation(
                    translation.x,
                    translation.y,
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
        boardState?.setMove(null);
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

    const isPieceTouchingBoard = () => {
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
                if (intersects.length > 0) {
                    return true;
                }
            }
            return false;
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

    const lowerPieceHeight = () => {
        if (ref.current && pieceAnimationState.current !== 'lowering') {
            pieceAnimationState.current = 'lowering';
            gsap.to(ref.current.position, {
                y: positionY,
                duration: animationDuration,
                ease: 'power1.inOut',
                onComplete: () => {
                    pieceAnimationState.current = null;
                },
            });
        }
    };

    const increasePieceHeight = () => {
        if (ref.current && pieceAnimationState.current !== 'increasing') {
            pieceAnimationState.current = 'increasing';
            gsap.to(ref.current.position, {
                y: positionY + 2,
                duration: animationDuration,
                ease: 'power1.inOut',
                onComplete: () => {
                    pieceAnimationState.current = null;
                },
            });
        }
    };

    const onDrag = () => {
        //* Snap the shadow to the grid
        // if (isPieceTouchingBoard()) {
        // lowerPieceHeight();
        // } else {
        // increasePieceHeight();
        // }

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

        const snapPosition = new THREE.Vector3(snapX, 0, snapZ).add(offset);
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
                    onPointerOver={() => setIsHovering(true)}
                    onPointerOut={() => setIsHovering(false)}
                    ref={ref}>
                    <PieceModel
                        isHovering={isHovering}
                        isDragging={isDragging}
                        pieceCode={pieceCode}
                        block_positions={block_positions}
                        blockSize={blockSize}
                        positionY={positionY}
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

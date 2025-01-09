import {LoadedModels, useLoadedModels} from '@/Hooks/useLoadedModels';
import {useBoardState} from '@/Store/board_state';
import {usePlayerPositions} from '@/Store/player_positions';
import gsap from 'gsap';
import {memo, useMemo, useRef} from 'react';
import {Object3D} from 'three';

export const PlayerModels = memo(() => {
    const models = useLoadedModels();
    const positions = usePlayerPositions();
    const modelHeight = 2.25;
    const isPlayerAlive = useBoardState(state => state.isPlayerAlive);
    const isGameOnGoing = useBoardState(state => state.isGameOnGoing);
    const ui_state = useBoardState(state => state.gameState.ui_state);
    const Models = useMemo(() => {
        return (
            <>
                <PlayerModel
                    model={models.duck.green}
                    position={[
                        positions.playerPositions.green?.x ?? 0,
                        modelHeight,
                        positions.playerPositions.green?.y ?? 0,
                    ]}
                />
                <PlayerModel
                    model={models.duck?.red}
                    position={[
                        positions.playerPositions.red?.x ?? 0,
                        modelHeight,
                        positions.playerPositions.red?.y ?? 0,
                    ]}
                />
                <PlayerModel
                    model={models.duck?.blue}
                    position={[
                        positions.playerPositions.blue?.x ?? 0,
                        modelHeight,
                        positions.playerPositions.blue?.y ?? 0,
                    ]}
                />
                <PlayerModel
                    model={models.duck?.yellow}
                    position={[
                        positions.playerPositions.yellow?.x ?? 0,
                        modelHeight,
                        positions.playerPositions.yellow?.y ?? 0,
                    ]}
                />
            </>
        );
    }, [models.duck, modelHeight, positions]);
    if (isGameOnGoing()) {
        return <>{Models}</>;
    } else {
        return null;
    }
});

type Props = {
    model?: Object3D | null;
    position: [number, number, number];
};
const DURATION = 0.25;
const PlayerModel = ({model, position}: Props) => {
    const ref = useRef<Object3D | null>(null);
    const isAnimating = useRef(false);
    const handleClick = () => {
        if (ref.current && !isAnimating.current) {
            isAnimating.current = true;
            const offset = 0.5;
            gsap.to(ref.current.position, {
                y: ref.current.position.y + offset,
                duration: DURATION,
                onComplete: () => {
                    if (ref.current) {
                        gsap.to(ref.current.position, {
                            y: ref.current.position.y - offset,
                            duration: DURATION * 0.75,
                            onComplete: () => {
                                isAnimating.current = false;
                            },
                        });
                    }
                },
            });
        }
    };
    if (model) {
        return (
            <>
                <primitive
                    ref={ref}
                    onClick={handleClick}
                    object={model}
                    position={[position[0] + 0.2, position[1], position[2]]}
                    rotation={[
                        0,
                        position[2] > 1
                            ? Math.PI
                            : position[2] < -1
                              ? 0
                              : position[0] > 1
                                ? -Math.PI * 0.5
                                : Math.PI * 0.5,
                        0,
                    ]}
                />
            </>
        );
    } else {
        return null;
    }
};

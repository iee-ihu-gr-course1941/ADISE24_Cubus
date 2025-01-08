import {create} from 'zustand';
import * as THREE from 'three';
import {useTimerStore} from './timer';
import {CAMERA_ANIMATION_DURATION} from '@/Constants/camera';
import {GameState, MovePayload, PlayerColor, PlayerState} from '@/types/game';
import {GameSession} from '@/types/models/tables/Session';

type State = {
    boardRef: THREE.Mesh | null;
    boardPieces: THREE.Group[];
    move: MovePayload | null;
    gameState: GameState;
    playerState: PlayerState | null;
};

type Actions = {
    setState: (game: GameSession, player: PlayerState) => void;
    updateGameState: (game: GameSession) => void;
    setBoardRef: (boardRef: THREE.Mesh | null) => void;
    addBoardPiece: (piece: THREE.Group) => void;
    setMove: (move: MovePayload | null) => void;
    rejectMove: () => void;
    startGame: () => void;
    lockTurn: () => void;
    beginTurn: () => void;
    endTurn: () => void;
    continueTurn: () => void;
    canPlay: () => boolean;
    removeBoardPiece: (piece: THREE.Group) => void;
    changeTurn: () => void;
    getPoints: () => number;
    getHasFinished: () => boolean;
};

export type BoardState = State & Actions;

export const useBoardState = create<BoardState>()((set, get, _) => ({
    boardRef: null,
    boardPieces: [],
    move: null,
    gameState: {
        id: null,
        startTime: 0,
        endTime: 0,
        current_round: 0,
        ui_state: 'Ready',
        session_state: 'waiting',
        current_playing: 'blue',
    },
    playerState: null,
    updateGameState: game => {
        set(prev => {
            return {
                gameState: {
                    ...prev.gameState,
                    ...game,
                    ui_state: getUiState(game, prev.playerState),
                },
            };
        });
    },
    setState: (game, player) => {
        set(prev => {
            return {
                gameState: {
                    ...prev.gameState,
                    ...game,
                    ui_state: getUiState(game, player),
                },
                playerState: {...prev.playerState, ...player},
            };
        });
    },
    canPlay: () => {
        return get().gameState.ui_state === 'OwnTurnPlaying';
    },
    startGame: () => {
        const timer = useTimerStore.getState();
        timer.start(100);
        set({gameState: {...get().gameState, ui_state: 'Starting'}});
        setTimeout(() => {
            const {gameState, playerState} = get();
            timer.stop();
            console.log('getting player state:', get());
            if (playerState) {
                set(prev => ({
                    gameState: {
                        ...prev.gameState,
                        ui_state:
                            playerState.session_color ===
                            gameState.current_playing
                                ? 'OwnTurnPlaying'
                                : 'OpponentTurn',
                        startTime: Date.now(),
                    },
                }));
            }
        }, CAMERA_ANIMATION_DURATION + 250);
    },
    lockTurn: () => {
        set({gameState: {...get().gameState, ui_state: 'OwnTurnLocked'}});
    },
    beginTurn: () => {
        set(({gameState}) => {
            return {
                gameState: {
                    ...gameState,
                    state: 'OwnTurnPlaying',
                    startTime: Date.now(),
                },
            };
        });
    },
    changeTurn: () => {
        set(({gameState}) => {
            return {
                gameState: {
                    ...gameState,
                    startTime: Date.now(),
                },
            };
        });
    },
    continueTurn: () => {
        set(({gameState}) => ({
            gameState: {...gameState, ui_state: 'OwnTurnPlaying'},
        }));
    },
    endTurn: () => {
        set(({gameState}) => ({
            gameState: {
                ...gameState,
                state: 'OpponentTurn',
                startTime: Date.now(),
            },
            move: null,
        }));
    },
    setMove: move => {
        set({move});
    },
    rejectMove: () => {
        set(({move}) => ({move: null}));
    },
    setBoardRef: boardRef => {
        set({boardRef});
    },
    addBoardPiece: piece =>
        set(prev => {
            if (prev.boardPieces.find(p => p.uuid === piece.uuid)) return prev;
            return {boardPieces: [...prev.boardPieces, piece]};
        }),
    removeBoardPiece: piece =>
        set(prev => {
            return {
                boardPieces: prev.boardPieces.filter(
                    p => p.uuid !== piece.uuid,
                ),
            };
        }),
    getPoints: () => {
        return (
            (() => {
                const playerState = get().playerState;
                const gameState = get().gameState;
                if (!playerState) return 0;
                if (playerState.session_color === 'blue')
                    return gameState.player_blue_points;
                if (playerState.session_color === 'green')
                    return gameState.player_green_points;
                if (playerState.session_color === 'red')
                    return gameState.player_red_points;
                return gameState.player_yellow_points;
            })() ?? 0
        );
    },
    getHasFinished: () => {
        return (
            (() => {
                const playerState = get().playerState;
                const gameState = get().gameState;
                if (!playerState) return false;
                if (playerState.session_color === 'blue')
                    return gameState.player_blue_has_finished;
                if (playerState.session_color === 'green')
                    return gameState.player_green_has_finished;
                if (playerState.session_color === 'red')
                    return gameState.player_red_has_finished;
                return gameState.player_yellow_has_finished;
            })() ?? false
        );
    },
}));

const getUiState = (
    game: GameSession,
    player: PlayerState | undefined | null,
) => {
    if (game.board_state?.length === 0) {
        return 'Ready';
    }
    const ui_state =
        game.session_state === 'waiting'
            ? 'Ready'
            : game.session_state === 'complete'
              ? 'Finished'
              : game.session_state === 'playing'
                ? game.current_playing === player?.session_color
                    ? 'OwnTurnPlaying'
                    : 'OpponentTurn'
                : 'Finished';
    return ui_state;
};

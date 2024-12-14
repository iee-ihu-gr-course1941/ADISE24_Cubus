import { create } from "zustand"
import {subscribeWithSelector} from 'zustand/middleware'
import * as THREE from "three";
import { GameState, MovePayload } from "@/types/piece";

type State = {
    boardRef: THREE.Mesh | null;
    boardPieces: THREE.Group[];
    move: MovePayload | null;
    gameState: GameState;
}

type Actions = {
    setBoardRef: (boardRef: THREE.Mesh | null) => void
    addBoardPiece: (piece: THREE.Group) => void;
    setMove: (move: MovePayload | null) => void;
    rejectMove: () => void;
    startGame: (player_count: number) => void;
    lockTurn: () => void;
    beginTurn: () => void;
    endTurn: () => void;
    continueTurn: () => void;
    canPlay: () => boolean;
    removeBoardPiece: (piece: THREE.Group) => void;
}

export type BoardState = State & Actions

export const useBoardState = create<BoardState>()((set, get, state) => ({
    boardRef: null,
    boardPieces: [],
    move: null,
    gameState: {
        startTime: 0,
        endTime: 0,
        round: 0,
        player_turn: 0,
        state: 'Ready',
        player_count: 0,
    },
    canPlay: () => {
        return get().gameState.state === 'OwnTurnPlaying'
    },
    startGame: (player_count: number) => {
        set({gameState: {round: 1, player_turn: 0, state: 'OwnTurnPlaying', startTime: Date.now(), player_count: player_count}})
    },
    lockTurn: () => {
        set({gameState: {...get().gameState, state: 'OwnTurnLocked'}})
    },
    beginTurn: () => {
        set(({gameState}) => (
            {gameState: {
                ...gameState,round: gameState.round + 1, state: 'OwnTurnPlaying',startTime: Date.now()
            }}))
    },
    continueTurn: () => {
        set(({gameState}) => ({gameState: {...gameState, state: 'OwnTurnPlaying'}}))
    },
    endTurn: () => {
        set(({gameState}) => ({gameState: {
            ...gameState, state: 'OpponentTurn', startTime: Date.now()
        }, move: null}))
    },
    setMove: (move) => {
        set({move})
    },
    rejectMove: () => {
        set(({move}) => ({move: null}))
    },
    setBoardRef: (boardRef) => {
        set({boardRef})
    },
    addBoardPiece: (piece) => set((prev) => {
        if(prev.boardPieces.find(p => p.uuid === piece.uuid)) return prev
        return {boardPieces: [...prev.boardPieces,piece]}
    }),
    removeBoardPiece: (piece) => set((prev) => {
        return {boardPieces: prev.boardPieces.filter(p => p.uuid !== piece.uuid)}
    }),
}));

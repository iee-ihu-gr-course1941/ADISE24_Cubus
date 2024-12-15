import { create } from "zustand"
import {subscribeWithSelector} from 'zustand/middleware'
import * as THREE from "three";
import { GameState, MovePayload, PlayerIdentifier } from "@/types/piece";
import { useTimerStore } from "./timer";

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
    startGame: (player_count: number, player_identifier: PlayerIdentifier, player_turn: PlayerIdentifier) => void;
    lockTurn: () => void;
    beginTurn: () => void;
    endTurn: () => void;
    continueTurn: () => void;
    canPlay: () => boolean;
    removeBoardPiece: (piece: THREE.Group) => void;
    changeTurn: (player_turn?: PlayerIdentifier) => void;
    getNextPlayer: () => PlayerIdentifier;
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
        player_turn: 'red',
        state: 'Ready',
        player_count: 0,
        player_identifier: null,
    },
    canPlay: () => {
        return get().gameState.state === 'OwnTurnPlaying'
    },
    startGame: (player_count, player_identifier, player_turn) => {
        set({gameState: {
            round: 1,
            player_identifier: player_identifier,
            player_turn: player_turn,
            state: player_identifier === player_turn ? 'OwnTurnPlaying' : 'OpponentTurn',
            startTime: Date.now(),
            player_count: player_count,
        }})
    },
    lockTurn: () => {
        set({gameState: {...get().gameState, state: 'OwnTurnLocked'}})
    },
    beginTurn: () => {
        set(({gameState}) => {
            return {
                gameState: {
                ...gameState,round: gameState.round + 1, state: 'OwnTurnPlaying',startTime: Date.now()
            }}
        });
    },
    changeTurn: (player_turn?: PlayerIdentifier) => {
        set(({gameState, getNextPlayer}) => {
            const playerTurn = player_turn ?? getNextPlayer();
            return {
                gameState: {
                    ...gameState,
                    player_turn: playerTurn,
                    state: gameState.player_identifier === (playerTurn) ? 'OwnTurnPlaying' : 'OpponentTurn',
                    startTime: Date.now(),
                }
            }
        })
    },
    continueTurn: () => {
        set(({gameState}) => ({gameState: {...gameState, state: 'OwnTurnPlaying'}}))
    },
    endTurn: () => {
        set(({gameState, getNextPlayer}) => ({gameState: {
            ...gameState, state: 'OpponentTurn', startTime: Date.now(),
            player_turn: getNextPlayer(),
        }, move: null}))
    },
    setMove: (move) => {
        set({move})
    },
    getNextPlayer: (): PlayerIdentifier => {
        const currentTurn = get().gameState.player_turn;
        const playerCount = get().gameState.player_count;
        if(currentTurn === 'green') return 'red';
        if(currentTurn === 'red' && playerCount===4) return 'blue';
        if(currentTurn === 'red' && playerCount===4) return 'blue';
        if(currentTurn === 'blue' && playerCount===4) return 'yellow';
        return 'green';
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

import { create } from "zustand"
import {subscribeWithSelector} from 'zustand/middleware'
import * as THREE from "three";

type State = {
    boardRef: THREE.Mesh | null
    boardPieces: THREE.Group[]
}

type Actions = {
    setBoardRef: (boardRef: THREE.Mesh | null) => void
    addBoardPiece: (piece: THREE.Group) => void;
}

export type BoardState = State & Actions

export const useBoardState = create<BoardState>()((set, get, state) => ({
    boardRef: null,
    boardPieces: [],
    setBoardRef: (boardRef) => {
        set({boardRef})
    },
    addBoardPiece: (piece) => set((prev) => {
        if(prev.boardPieces.find(p => p.uuid === piece.uuid)) return prev
        return {boardPieces: [...prev.boardPieces,piece]}
    }),
}));

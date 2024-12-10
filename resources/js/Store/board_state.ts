import { create } from "zustand"
import {subscribeWithSelector} from 'zustand/middleware'
import * as THREE from "three";

type State = {
    boardRef: THREE.Mesh | null
}

type Actions = {
    setBoardRef: (boardRef: THREE.Mesh | null) => void
}

export const useBoardState = create<State & Actions>()((set, get, state) => ({
    boardRef: null,
    setBoardRef: (boardRef) => {
        set({boardRef})
    }
}));

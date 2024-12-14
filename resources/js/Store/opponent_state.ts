import {  PlayerIdentifier, Vector2 } from "@/types/piece"
import { create } from "zustand"

type State = {
    occupiedPositions: {[key in PlayerIdentifier]: Vector2[]};
}

type Actions = {
    addOpponentOccupation: (positions: Vector2[], player: PlayerIdentifier) => void;
}

type OpponentState = State & Actions
export const useOpponentState = create<OpponentState>()((set, get, state) => ({
    occupiedPositions: {'green': [], 'red': [], 'blue': [], 'yellow': []},
    addOpponentOccupation: (positions: Vector2[], player: PlayerIdentifier) => {
        const occupiedPositions = get().occupiedPositions;
        set({occupiedPositions: {...occupiedPositions, [player]: [...occupiedPositions[player], ...positions]}})
    }
}));

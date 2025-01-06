import { PlayerColor } from "@/types/game";
import {   Vector2 } from "@/types/piece"
import { create } from "zustand"

type State = {
    occupiedPositions: {[key in PlayerColor]: Vector2[]};
}

type Actions = {
    addOpponentOccupation: (positions: Vector2[], player: PlayerColor) => void;
}

type OpponentState = State & Actions
export const useOpponentState = create<OpponentState>()((set, get, state) => ({
    occupiedPositions: {'green': [], 'red': [], 'blue': [], 'yellow': []},
    addOpponentOccupation: (positions: Vector2[], player: PlayerColor) => {
        const occupiedPositions = get().occupiedPositions;
        set({occupiedPositions: {...occupiedPositions, [player]: [...occupiedPositions[player], ...positions]}})
    }
}));

import { create } from "zustand";
import { useBoardState } from "./board_state";

type GameDimensionProps = {
    blockSize: number;
    getGridSize: (playerCount: number) => number;
}


export const useGameDimensions = create<GameDimensionProps>()((set, get, _) => ({
    blockSize: 0.5,
    getGridSize: (playerCount: number) => {
        if(playerCount === 0) return 10;
        const blockSize = get().blockSize;
        return playerCount > 2 ? (20*blockSize) : (14*blockSize);
    }
}));

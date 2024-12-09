import { create } from "zustand";

type GameDimensionProps = {
    gridSize: number;
    blockSize: number;
    getGridSize: () => number;
}


export const useGameDimensions = create<GameDimensionProps>()((set, _, state) => ({
    gridSize: 20,
    blockSize: 0.5,
    getGridSize: () =>  {
        const {gridSize, blockSize} = state.getState();
        return gridSize * blockSize;
    }
}));

import { create } from "zustand";
import { useBoardState } from "./board_state";

type GameDimensionProps = {
    blockSize: number;
}


export const useGameDimensions = create<GameDimensionProps>()((set, _, state) => ({
    blockSize: 0.5,
}));

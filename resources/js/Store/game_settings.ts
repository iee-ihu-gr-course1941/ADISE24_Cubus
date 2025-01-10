import {create} from 'zustand';

export type GameSettings = {
    gridHelper: boolean;
    enableLights: boolean;
};

type Actions = {
    setGridHelper: (gridHelper: boolean) => void;
    setEnableLights: (enableLights: boolean) => void;
};

export const useGameSettings = create<GameSettings & Actions>((set, get) => ({
    gridHelper: false,
    enableLights: true,
    setGridHelper: gridHelper => set({gridHelper}),
    setEnableLights: enableLights => set({enableLights}),
}));

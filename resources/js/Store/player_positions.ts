import {PlayerColor} from '@/types/game';
import {Vector2} from '@/types/piece';
import {create} from 'zustand';

type State = {
    playerPositions: {[key in PlayerColor]: Vector2 | null};
};

type Actions = {
    setPlayerPosition: (playerColor: PlayerColor, position: Vector2) => void;
};

export const usePlayerPositions = create<State & Actions>()((set, get) => ({
    playerPositions: {
        green: null,
        red: null,
        blue: null,
        yellow: null,
    },
    setPlayerPosition: (playerColor, position) => {
        const state = get();
        if (!state.playerPositions[playerColor]) {
            set(state => ({
                playerPositions: {
                    ...state.playerPositions,
                    [playerColor]: position,
                },
            }));
        }
    },
}));

import {BoardUpdateEvent} from '@/types/connection';
import {create} from 'zustand';

type State = {
    latestMove: BoardUpdateEvent | null;
    setLatestMove: (move: BoardUpdateEvent | null) => void;
};

export const useUserEventsStore = create<State>((set, get) => ({
    latestMove: null,
    setLatestMove: (move: BoardUpdateEvent | null) => {
        set({latestMove: move});
    },
}));

import { create } from "zustand";

type StateProps =  {
    value: number;
    increment: () => void;
    decrement: () => void;
}

export const useBasicStore = create<StateProps>()((set) => ({
    value: 0,
    increment: () => set((state) => ({ value: state.value + 1 })),
    decrement: () => set((state) => ({ value: state.value - 1 })),
}))

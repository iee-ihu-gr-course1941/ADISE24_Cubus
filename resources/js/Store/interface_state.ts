import { create } from "zustand";

type Action = 'none' | 'rotate_pos' | 'rotate_neg' | 'flip';

type Props = {
    action: Action;
}

type Actions = {
    setAction: (action: Action) => void;
}

type InterfaceState =  Props & Actions;

export const useInterfaceState = create<InterfaceState>((set, get) => ({
    action: 'none',
    setAction: (action) => {
        const {action: currentAction} = get();
        if(action !== 'none' && currentAction !== 'none'){
            return;
        }
        set({ action })
    },
}));

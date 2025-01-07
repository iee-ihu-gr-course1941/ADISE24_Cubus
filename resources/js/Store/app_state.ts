import { GameSession } from "@/types/models/tables/Session";
import { User } from "@/types/models/tables/User";
import { create } from "zustand";

type StateProps =  {
    user?: User;
    currentSession?: GameSession;

    setUser: (user: User) => void;
    setCurrentSession: (session: GameSession) => void;
}

export const useAppState = create<StateProps>((set) => ({
    user: undefined,
    currentSession: undefined,
    setUser: (user) => set({ user }),
    setCurrentSession: (session) => set({ currentSession: session }),
}))

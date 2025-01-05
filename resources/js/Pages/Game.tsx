import useUserEvents from '@/Connection/useUserEvents';
import { Experience } from "@/Game/Experience";
import { getGame } from '@/network/session_network';
import { PageProps } from '@/types';
import { GameResponse } from '@/types/game';
import { User } from '@/types/models/tables/User';
import { useEffect } from 'react';

type GameProps = PageProps<{ user: User, userSession?: GameResponse }>;

export default function Game({ user, userSession }: GameProps) {
    let { connectionState, currentSession, joinGame } = useUserEvents();
    console.log(userSession)
    useEffect(() => {
        /**
         * * Join Game
         */
        joinGame();
    }, [])
    return (
        <Experience/>
    );
}

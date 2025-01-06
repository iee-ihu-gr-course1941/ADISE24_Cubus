import useUserEvents from '@/Connection/useUserEvents';
import {Experience} from '@/Game/Experience';
import {useBoardState} from '@/Store/board_state';
import {useUserEventsStore} from '@/Store/user_events_store';
import {PageProps} from '@/types';
import {GameResponse} from '@/types/game';
import {User} from '@/types/models/tables/User';
import {useEffect, useMemo} from 'react';

type GameProps = PageProps<{user: User; userSession?: GameResponse}>;

export default function Game({user, userSession}: GameProps) {
    const {currentSession, joinGame, latestMove} = useUserEvents();
    const setState = useBoardState(state => state.setState);
    const updateGameState = useBoardState(state => state.updateGameState);
    const setLatestMove = useUserEventsStore(s => s.setLatestMove);

    useEffect(() => {
        setLatestMove(latestMove);
        if (latestMove) {
            updateGameState(latestMove.session);
        }
    }, [latestMove]);

    useEffect(() => {
        const session = currentSession ?? userSession;
        if (session) {
            setState({...session.session}, {...session.player});
        }
    }, [currentSession, userSession]);

    useEffect(() => {
        /**
         * * Join Game
         */
        joinGame();
    }, []);
    return <Experience />;
}

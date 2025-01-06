import useUserEvents from '@/Connection/useUserEvents';
import {Experience} from '@/Game/Experience';
import {getGame} from '@/network/session_network';
import {useBoardState} from '@/Store/board_state';
import {PageProps} from '@/types';
import {GameResponse} from '@/types/game';
import {User} from '@/types/models/tables/User';
import {useEffect, useMemo} from 'react';

type GameProps = PageProps<{user: User; userSession?: GameResponse}>;

export default function Game({user, userSession}: GameProps) {
    const {currentSession, joinGame} = useUserEvents();
    const setState = useBoardState(state => state.setState);

    const session = useMemo(() => {
        const session = currentSession ?? userSession;
        if (session) {
            setState(
                {...session.session, player_count: 4},
                {...session.player},
            );
        }

        return session;
    }, [currentSession, userSession]);

    useEffect(() => {
        /**
         * * Join Game
         */
        joinGame();
    }, []);
    return <Experience />;
}

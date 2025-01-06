/**
 * Handles all user events that aren't relying in a game session.
 *
 * Registered events:
 * - LoginEvent: Once login is finalized connect to the server
 *
 */

import {useEffect, useState} from 'react';
import useServerEvents from './useServerEvents';
import {BoardUpdateEvent, LoginEvent} from '@/types/connection';
import {getGame} from '@/network/session_network';
import {GameResponse} from '@/types/game';

export default function useUserEvents() {
    let {connectionState, listen, stopListening} = useServerEvents();
    let [gameId, setGameId] = useState<string>('1');
    let [session, setSession] = useState<GameResponse | null>(null);
    let [latestMove, setLatestMove] = useState<BoardUpdateEvent | null>(null);

    const cookies = parseCookies();
    const publicUserToken = cookies.get('user-token')!;

    useEffect(() => {
        console.info('Creating login event ws listener for: ', publicUserToken);
        listen(`session.${publicUserToken}`, 'LoginEvent', event => {
            loginEventCallback(event, publicUserToken);
        });

        if (gameId.length !== 0) {
            console.info('Creating game event ws listener for: ', gameId);
            listen(`.game.${gameId}`, 'ConnectEvent', event => {
                console.log(
                    '[USER CONNECTED] Received ConnectEvent for: ',
                    event,
                );
                setSession(event.game_session);
            });

            listen(`.game.${gameId}`, 'BoardUpdateEvent', event => {
                console.log('Received update for: ', event);
                setLatestMove(event);
            });
        }

        return () => {
            stopListening(`session.${publicUserToken}`, 'LoginEvent');
            stopListening(`.game.${gameId}`, 'ConnectEvent');
        };
    }, [connectionState, gameId]);

    const joinGame = async () => {
        const res = await getGame();
        if (res) {
            setGameId(res.session.id.toString());
            console.log('[JOINED GAME]', res);
        }
    };

    return {
        connectionState,
        joinGame: joinGame,
        currentSession: session,
        latestMove,
    };
}

function loginEventCallback(event: LoginEvent, publicUserToken?: string) {
    if (publicUserToken == null || publicUserToken.length === 0) {
        return;
    }

    if (!event.success) return;

    if (event.redirect_url === '') {
        location.reload();
    } else {
        location.assign(event.redirect_url);
    }
}

function parseCookies(): Map<string, string> {
    // @ts-ignore
    return new Map(
        document.cookie.split('; ').map(cookie => cookie.split('=')),
    );
}

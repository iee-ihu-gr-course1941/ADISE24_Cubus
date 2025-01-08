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
import { useAppState } from '@/Store/app_state';

export default function useUserEvents() {
    let {connectionState, listen, stopListening} = useServerEvents();
    let { currentSession, setCurrentSession } = useAppState();
    let [latestMove, setLatestMove] = useState<BoardUpdateEvent | null>(null);

    const cookies = parseCookies();
    const publicUserToken = cookies.get('user-token')!;

    useEffect(() => {
        console.info('Creating login event ws listener for: ', publicUserToken);
        listen(`session.${publicUserToken}`, 'LoginEvent', event => {
            loginEventCallback(event, publicUserToken);
        });

        if (currentSession != null) {
            const gameId = currentSession.id;
            console.info('Creating game event ws listener for: ', gameId);
            listen(`.game.${gameId}`, 'ConnectEvent', event => {
                console.log('Received session update:', event);
                setCurrentSession(event.game_session);
            });

            listen(`.game.${gameId}`, 'BoardUpdateEvent', event => {
                console.log('Received update for: ', event);
                setLatestMove(event);
            });
        }

        return () => {
            stopListening(`session.${publicUserToken}`, 'LoginEvent');

            if(currentSession != null) {
                const gameId = currentSession.id;
                stopListening(`.game.${gameId}`, 'ConnectEvent');
                stopListening(`.game.${gameId}`, 'BoardUpdateEvent');
            }
        };
    }, [connectionState, currentSession]);

    return {
        connectionState,
        latestMove,
    };
}

function loginEventCallback(event: LoginEvent, publicUserToken?: string) {
    if (publicUserToken == null || publicUserToken.length === 0) {
        return;
    }

    if (!event.success) return;
    setTimeout(() => window.open('/game', '_self'), 50);
}

function parseCookies(): Map<string, string> {
    // @ts-ignore
    return new Map(document.cookie.split('; ').map(cookie => cookie.split('=')));
};

/**
 * Handles all user events that aren't relying in a game session.
 *
 * Registered events:
 * - LoginEvent: Once login is finalized connect to the server
 *
 */

import { useEffect, useState } from "react";
import useServerEvents from "./useServerEvents";
import { Game_session } from "@/types/models/tables/Session";
import { LoginEvent } from "@/types/connection";

export default function useUserEvents() {
    let { connectionState, listen, stopListening } = useServerEvents();
    let [ gameId, setGameId ] = useState<string>('');
    let [ session, setSession ] = useState<Game_session | null>(null);

    const cookies = parseCookies();
    const publicUserToken = cookies.get('user-token')!;

    useEffect(() => {
        console.info('Creating login event ws listener for: ', publicUserToken);
        listen(`session.${publicUserToken}`, 'LoginEvent', event => {
            loginEventCallback(event, publicUserToken);
        });

        if(gameId.length === 0) return;
        console.info('Creating game event ws listener for: ', gameId);
        listen(`.game.${gameId}`, 'ConnectEvent', gameSession => {
            setSession(gameSession);
        });

        return () => {
            stopListening(`session.${publicUserToken}`, 'LoginEvent');
            stopListening(`.game.${gameId}`, 'ConnectEvent');
        }
    }, [connectionState, gameId]);

    return {
        connectionState,
        joinGame: setGameId,
        currentSession: session,
    };
}

function loginEventCallback(event: LoginEvent, publicUserToken?: string) {
    if(publicUserToken == null || publicUserToken.length === 0) {
        return;
    }

    if(!event.success) return;

    if(event.redirect_url === '') {
        location.reload();
    } else {
        location.assign(event.redirect_url);
    }
}

function parseCookies(): Map<string, string> {
    // @ts-ignore
    return new Map(document.cookie.split('; ').map(cookie => cookie.split('=')));
};

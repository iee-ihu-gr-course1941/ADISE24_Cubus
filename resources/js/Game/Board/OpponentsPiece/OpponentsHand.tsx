import {useBoardState} from '@/Store/board_state';
import {useEffect, useState} from 'react';
import * as THREE from 'three';
import {OpponentPiece} from './OpponentPiece';
import {OpponentMove} from '@/types/game';
import {useUserEventsStore} from '@/Store/user_events_store';
import {formatOpponentMoveOrigin} from '@/libs/move';

export const OpponentsHand = () => {
    const [occupations, setOccupations] = useState<OpponentMove['move'][]>([]);
    const latestMove = useUserEventsStore(state => state.latestMove);
    console.log('latest move:', latestMove);
    const ui_state = useBoardState(state => state.gameState.ui_state);
    const playerCount = useBoardState(state => state.gameState.player_count);
    const session_color = useBoardState(
        state => state.playerState?.session_color,
    );

    useEffect(() => {
        console.log('latest move:', latestMove, ui_state);
        if (latestMove && latestMove.move.player_color !== session_color) {
            setOccupations([
                ...occupations,
                formatOpponentMoveOrigin(latestMove.move, playerCount),
            ]);
        }
    }, [latestMove]);

    return (
        <>
            {occupations.map((movement, index) => {
                return <OpponentPiece key={index} {...movement} />;
            })}
        </>
    );
};

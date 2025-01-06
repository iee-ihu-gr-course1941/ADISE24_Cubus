import {useBoardState} from '@/Store/board_state';
import {useGameDimensions} from '@/Store/game_dimensions';
import {PieceCode, Vector2} from '@/types/piece';
import {useControls} from 'leva';
import {useEffect, useState} from 'react';
import * as THREE from 'three';
import {OpponentPiece} from './OpponentPiece';
import {PiecePositions} from '@/Constants/Piece';
import {OpponentMove} from '@/types/game';
import useUserEvents from '@/Connection/useUserEvents';

export const OpponentsHand = () => {
    const [occupations, setOccupations] = useState<OpponentMove[]>([]);
    const {latestMove} = useUserEvents();
    const ui_state = useBoardState(state => state.gameState.ui_state);

    useEffect(() => {
        console.log('latest move:', latestMove, ui_state);
        if (ui_state === 'OpponentTurn' && latestMove) {
            //* Generate a random opponent move for demo
            // const randomX = Math.round((((Math.random() - 0.5) * gridSize)) / blockSize) * blockSize;
            // const randomY = Math.round((((Math.random() - 0.5) * gridSize)) / blockSize) * blockSize;
            // const opponentMovePayload: OpponentMove = {
            //     block_positions: PiecePositions[occupations.length as PieceCode],
            //     origin_x: randomX,
            //     origin_y: randomY,
            //     player_color: playerTurn,
            //     player_id: '123',
            // }
            setTimeout(
                () => {
                    setOccupations([...occupations, latestMove]);
                },
                Math.random() * 500 + 250,
            );
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

import { useInterval } from "@/Hooks/useInterval";
import { useBoardState } from "@/Store/board_state";
import { useTimerStore } from "@/Store/timer";
import { PlayerIdentifier } from "@/types/piece";
import { useEffect, useMemo, useRef, useState } from "react";


export const Interface = () => {
    const startGame = useBoardState(state => state.startGame);
    const lockTurn = useBoardState(state => state.lockTurn);
    const playerTurn = useBoardState(state => state.gameState.player_turn);
    const {state, round, startTime} = useBoardState(state => state.gameState);
    const move = useBoardState(state => state.move);
    const boardPieces = useBoardState(state => state.boardPieces);
    const [timer, setTimer] = useState(0);
    const {time,start} = useTimerStore();
    const [isStarting, setIsStarting] = useState(false);

    useInterval(() => {
        setTimer(Math.round(((Date.now() - (startTime ?? 0))/1000)*10)/10);
    }, 100)

    const onStartGame = (playerCount: number, playerIdentifier: PlayerIdentifier, playerTurn: PlayerIdentifier) => {
        setIsStarting(true);
        start(1000);
        setTimeout(() => {
            setIsStarting(false);
            startGame(playerCount, playerIdentifier, playerTurn);
        }, 3250)
    }
    return (
        <div className='interface'>
            <div className="game-state">
                <p>Game State: {state}</p>
                <p>Board Pieces: {boardPieces.length}</p>
                {
                state !== 'Ready' &&
                <>
                    <p>Round: {round}</p>
                    <p>Time: {timer}</p>
                    <p>Playing: {playerTurn}</p>
                    <p className="playing">{(state === 'OwnTurnPlaying' || state === 'OwnTurnLocked') ? 'You are playing!' : 'Opponent is playing!'}</p>
                </>
                }
            </div>
            {isStarting && <p className="starting-text">Starting in {3 - time}...</p>}
            {!isStarting && <div className="btn-group">
                {
                    state === 'Ready' &&
                    <>
                    <div className="start-group">
                        <button datatype={state == 'Ready' ? '' : 'blocked'} onClick={() => onStartGame(2, 'green', 'green')}>Start Game 2 Green</button>
                        <button datatype={state == 'Ready' ? '' : 'blocked'} onClick={() => onStartGame(2, 'red', 'green')}>Start Game 2 Red</button>
                    </div>
                    <div className="start-group">
                        <button datatype={state == 'Ready' ? '' : 'blocked'} onClick={() => onStartGame(4, 'green', 'green')}>Start Game 4 Green</button>
                        <button datatype={state == 'Ready' ? '' : 'blocked'} onClick={() => onStartGame(4, 'red', 'green')}>Start Game 4 Red</button>
                        <button datatype={state == 'Ready' ? '' : 'blocked'} onClick={() => onStartGame(4, 'blue', 'green')}>Start Game 4 Blue</button>
                        <button datatype={state == 'Ready' ? '' : 'blocked'} onClick={() => onStartGame(4, 'yellow', 'green')}>Start Game 4 Yellow</button>
                    </div>
                    </>
                }
                {state !== 'Ready' && state !== 'Finished' && <button datatype={(state === 'OwnTurnPlaying' && move) ? '' : 'blocked'} onClick={lockTurn}>Lock Turn</button>}
                {/* <button datatype={state === 'OpponentTurn' ? '' : 'blocked'} onClick={() => changeTurn('red')}>End Opponent Turn</button> */}
            </div>}
        </div>
    );
}

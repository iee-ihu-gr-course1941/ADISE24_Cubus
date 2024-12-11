import { useInterval } from "@/Hooks/useInterval";
import { useBoardState } from "@/Store/board_state";
import { useEffect, useMemo, useRef, useState } from "react";


export const Interface = () => {
    const startGame = useBoardState(state => state.startGame);
    const lockTurn = useBoardState(state => state.lockTurn);
    const beginOwnTurn = useBoardState(state => state.beginTurn);
    const {state, round, startTime} = useBoardState(state => state.gameState);
    const boardPieces = useBoardState(state => state.boardPieces);
    const [timer, setTimer] = useState(0);

    useInterval(() => {
        setTimer(Math.round(((Date.now() - (startTime ?? 0))/1000)*10)/10);
    }, 100)

    return (
        <div className='interface'>
            <div className="game-state">
                <p>Game State: {state}</p>
                <p>Board Pieces: {boardPieces.length}</p>
                {state !== 'Ready' && <p>Round: {round}</p>}
                {state !== 'Ready' &&<p>Time: {timer}</p>}
            </div>
            <div className="btn-group">
                <button datatype={state == 'Ready' ? '' : 'blocked'} onClick={startGame}>Start Game</button>
                <button datatype={state === 'OwnTurnPlaying' ? '' : 'blocked'} onClick={lockTurn}>Lock Turn</button>
                <button datatype={state === 'OpponentTurn' ? '' : 'blocked'} onClick={beginOwnTurn}>End Opponent Turn</button>
            </div>
        </div>
    );
}

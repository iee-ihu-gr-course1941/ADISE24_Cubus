import { useInterval } from "@/Hooks/useInterval";
import { FlipIcon, RotateIcon } from "@/Icons/InterfaceIcons";
import { useBoardState } from "@/Store/board_state";
import { useInterfaceState } from "@/Store/interface_state";
import { useTimerStore } from "@/Store/timer";
import { PlayerIdentifier } from "@/types/piece";
import { useState } from "react";


export const Interface = () => {
    const startGame = useBoardState(state => state.startGame);
    const lockTurn = useBoardState(state => state.lockTurn);
    const playerTurn = useBoardState(state => state.gameState.player_turn);
    const {state, round, startTime} = useBoardState(state => state.gameState);
    const move = useBoardState(state => state.move);
    const boardPieces = useBoardState(state => state.boardPieces);
    const [timer, setTimer] = useState(0);
    const {time} = useTimerStore();
    const {setAction, action} = useInterfaceState();

    useInterval(() => {
        setTimer(Math.round(((Date.now() - (startTime ?? 0))/1000)*10)/10);
    }, 100)

    const onStartGame = (playerCount: number, playerIdentifier: PlayerIdentifier, playerTurn: PlayerIdentifier) => {
        startGame(playerCount, playerIdentifier, playerTurn);
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
            {state === 'Starting' && <p className="starting-text">Starting in {Math.round(3 - (time/10))}...</p>}
            {state !== 'Starting' &&
            <div className="btn-group">
                {move && <div></div>}
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
                {state !== 'Ready' && state !== 'Finished' && <button datatype={(state === 'OwnTurnPlaying' && move) ? '' : 'blocked'} onClick={(state === 'OwnTurnPlaying' && move) ? lockTurn : undefined}>Lock Turn</button>}
                {/* <button datatype={state === 'OpponentTurn' ? '' : 'blocked'} onClick={() => changeTurn('red')}>End Opponent Turn</button> */}
                {move &&
                <div className="flex gap-x-2">
                    <RotateIcon enabled={action === 'none'} onClick={() => setAction('rotate_neg')} color="#f87171"/>
                    <FlipIcon enabled={action === 'none'} onClick={() => setAction('flip')}/>
                    <RotateIcon enabled={action === 'none'} onClick={() => setAction('rotate_pos')} color="#22c55e"/>
                </div>
                }
            </div>}
        </div>
    );
}

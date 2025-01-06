import {useInterval} from '@/Hooks/useInterval';
import {FlipIcon, RotateIcon} from '@/Icons/InterfaceIcons';
import {useBoardState} from '@/Store/board_state';
import {useInterfaceState} from '@/Store/interface_state';
import {useTimerStore} from '@/Store/timer';
import {PlayerColor} from '@/types/game';
import {useState} from 'react';

export const Interface = () => {
    const startGame = useBoardState(state => state.startGame);
    const lockTurn = useBoardState(state => state.lockTurn);
    const {current_playing} = useBoardState(state => state.gameState);
    const playerState = useBoardState(state => state.playerState);
    const {ui_state, current_round, startTime} = useBoardState(
        state => state.gameState,
    );

    const move = useBoardState(state => state.move);
    const boardPieces = useBoardState(state => state.boardPieces);
    const playerPoints = useBoardState(state => state.getPoints);
    const getHasFinished = useBoardState(state => state.getHasFinished);
    const hasFinished = getHasFinished();
    const gameHasFinished = useBoardState(
        state => state.gameState.ui_state === 'Finished',
    );
    const [timer, setTimer] = useState(0);
    const {time} = useTimerStore();
    const {setAction, action} = useInterfaceState();

    useInterval(() => {
        setTimer(
            Math.round(((Date.now() - (startTime ?? 0)) / 1000) * 10) / 10,
        );
    }, 100);

    return (
        <div className="interface">
            <div className="game-state">
                <p>Game State: {ui_state}</p>
                <p>Board Pieces: {boardPieces.length}</p>
                {ui_state !== 'Ready' && (
                    <>
                        <p>Round: {current_round}</p>
                        <p>Points: {playerPoints()}</p>
                        <p>Time: {timer}</p>
                        <p>Playing: {current_playing}</p>
                        <p className="playing">
                            {ui_state === 'OwnTurnPlaying' ||
                            ui_state === 'OwnTurnLocked'
                                ? 'You are playing!'
                                : 'Opponent is playing!'}
                        </p>
                    </>
                )}
            </div>
            {ui_state === 'Starting' && (
                <p className="starting-text">
                    Starting in {Math.round(3 - time / 10)}...
                </p>
            )}
            {ui_state !== 'Starting' && (
                <div className="btn-group">
                    {move && <div></div>}
                    {ui_state === 'Ready' && (
                        <>
                            <div
                                onClick={startGame}
                                className="px-4 py-3 bg-sky-600 text-white rounded cursor-pointer pointer-events-auto">
                                Start
                            </div>
                        </>
                    )}
                    {ui_state !== 'Ready' &&
                        ui_state !== 'Finished' &&
                        !hasFinished && (
                            <button
                                datatype={
                                    ui_state === 'OwnTurnPlaying' && move
                                        ? ''
                                        : 'blocked'
                                }
                                onClick={
                                    ui_state === 'OwnTurnPlaying' && move
                                        ? lockTurn
                                        : undefined
                                }>
                                Lock Turn
                            </button>
                        )}
                    {hasFinished && (
                        <div className="absolute bottom-20 left-0 w-full py-10 px-4 bg-gray-300 opacity-35 text-center">
                            {gameHasFinished
                                ? 'The game has Finished!'
                                : 'Waiting for other players to finish'}
                        </div>
                    )}
                    {/* <button datatype={state === 'OpponentTurn' ? '' : 'blocked'} onClick={() => changeTurn('red')}>End Opponent Turn</button> */}
                    {move && !hasFinished && (
                        <div className="flex gap-x-2">
                            <RotateIcon
                                enabled={action === 'none'}
                                onClick={() => setAction('rotate_neg')}
                                color="#f87171"
                            />
                            <FlipIcon
                                enabled={action === 'none'}
                                onClick={() => setAction('flip')}
                            />
                            <RotateIcon
                                enabled={action === 'none'}
                                onClick={() => setAction('rotate_pos')}
                                color="#22c55e"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

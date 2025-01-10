import {loadModels} from '@/Hooks/loadModels';
import {useInterval} from '@/Hooks/useInterval';
import {FlipIcon} from '@/Icons/InterfaceIcons';
import {Portrait} from '@/Icons/Portrait';
import {Icon, SVG} from '@/Icons/SVG';
import {Button} from '@/Inputs/Button';
import {PopupContainer, usePopup} from '@/Popup';
import {useAppState} from '@/Store/app_state';
import {useBoardState} from '@/Store/board_state';
import {useInterfaceState} from '@/Store/interface_state';
import {useTimerStore} from '@/Store/timer';
import {PlayerColor} from '@/types/game';
import {GameSession} from '@/types/models/tables/Session';
import {User} from '@/types/models/tables/User';
import {PropsWithChildren, useEffect, useState} from 'react';
import {Loading} from './Loading';

export const Interface = () => {
    const ui_state = useBoardState(state => state.gameState.ui_state);

    const gameHasFinished = useBoardState(
        state => state.gameState.ui_state === 'Finished',
    );
    // const [timer, setTimer] = useState(0);
    const {time} = useTimerStore();

    // useInterval(() => {
    //     setTimer(
    //         Math.round(((Date.now() - (startTime ?? 0)) / 1000) * 10) / 10,
    //     );
    // }, 100);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col">
            <PopupContainer className="pointer-events-auto" />
            <PlayersHUD />
            <div className="grow flex items-end">
                <ControlsHUD />
            </div>
            {gameHasFinished && <GameEndScreen isWin={true} />}
            <StartingTimer />
            <Loading />
        </div>
    );

    // return (
    //     <div className="interface">
    //         <div className="game-state">
    //             <p>Game State: {ui_state}</p>
    //             <p>Board Pieces: {boardPieces.length}</p>
    //             {ui_state !== 'Ready' && (
    //                 <>
    //                     <p>Round: {current_round}</p>
    //                     <p>Points: {playerPoints()}</p>
    //                     <p>Time: {timer}</p>
    //                     <p>Playing: {current_playing}</p>
    //                     <p className="playing">
    //                         {ui_state === 'OwnTurnPlaying' ||
    //                         ui_state === 'OwnTurnLocked'
    //                             ? 'You are playing!'
    //                             : 'Opponent is playing!'}
    //                     </p>
    //                 </>
    //             )}
    //         </div>
    //         {ui_state === 'Starting' && (
    //             <p className="starting-text">
    //                 Starting in {Math.round(3 - time / 10)}...
    //             </p>
    //         )}
    //         {ui_state !== 'Starting' && (
    //             <div className="btn-group">
    //                 {move && <div></div>}
    //                 {ui_state === 'Ready' && (
    //                     <>
    //                         <div
    //                             onClick={startGame}
    //                             className="px-4 py-3 bg-sky-600 text-white rounded cursor-pointer pointer-events-auto">
    //                             Start
    //                         </div>
    //                     </>
    //                 )}
    //                 {ui_state !== 'Ready' &&
    //                     ui_state !== 'Finished' &&
    //                     !hasFinished && (
    //                         <button
    //                             datatype={
    //                                 ui_state === 'OwnTurnPlaying' && move
    //                                     ? ''
    //                                     : 'blocked'
    //                             }
    //                             onClick={
    //                                 ui_state === 'OwnTurnPlaying' && move
    //                                     ? lockTurn
    //                                     : undefined
    //                             }>
    //                             Lock Turn
    //                         </button>
    //                     )}
    //                 {hasFinished && (
    //                     <div className="absolute bottom-20 left-0 w-full py-10 px-4 bg-gray-300 opacity-35 text-center">
    //                         {gameHasFinished
    //                             ? 'The game has Finished!'
    //                             : 'Waiting for other players to finish'}
    //                     </div>
    //                 )}
    //                 {/* <button datatype={state === 'OpponentTurn' ? '' : 'blocked'} onClick={() => changeTurn('red')}>End Opponent Turn</button> */}
    //                 <div className="flex gap-x-2">
    //                     <Button
    //                         icon={Icon.rotateLeft}
    //                         blocked={action !== 'none' || hasFinished}
    //                         onClick={() => setAction('rotate_neg')}
    //                     />

    //                     <FlipIcon
    //                         enabled={action === 'none'}
    //                         onClick={() => setAction('flip')}
    //                     />
    //                     <Button
    //                         icon={Icon.rotateRight}
    //                         blocked={action !== 'none' || hasFinished}
    //                         onClick={() => setAction('rotate_pos')}
    //                     />
    //                 </div>
    //             </div>
    //         )}
    //     </div>
    // );
};

const StartingTimer = () => {
    const ui_state = useBoardState(state => state.gameState.ui_state);

    const {time} = useTimerStore();

    return (
        <>
            {ui_state === 'Starting' && (
                <div className="absolute left-0 w-full justify-center text-center top-[40%]">
                    <p className="text-xl text-white">
                        Starting in {Math.round(3 - time / 10)}...
                    </p>
                </div>
            )}
        </>
    );
};

function PlayersHUD() {
    const {currentSession} = useAppState();

    if (!currentSession) return;

    return (
        <div className="p-4 flex gap-4">
            {['blue', 'red', 'green', 'yellow'].map((color, i) => {
                const currentPlayer = currentSession[
                    ('player_' + color) as keyof GameSession
                ] as User | null;
                if (currentPlayer == null) return;
                return (
                    <PlayerDetails
                        key={i}
                        user={currentPlayer}
                        playerPoints={
                            currentSession[
                                `player_${color}_points` as keyof GameSession
                            ] as number
                        }
                        color={color}
                    />
                );
            })}
        </div>
    );
}

type PlayerDetails = {
    user: User;
    color: string;
    playerPoints: number;
};

function PlayerDetails({user, playerPoints, color}: PlayerDetails) {
    if (user == null) return;

    let textColor;
    switch (color) {
        case 'blue':
            textColor = 'text-cyan-200';
            break;
        case 'red':
            textColor = 'text-red-200';
            break;
        case 'green':
            textColor = 'text-green-200';
            break;
        case 'yellow':
            textColor = 'text-yellow-200';
            break;
    }

    return (
        <div className="flex gap-4 items-start">
            <Portrait
                url={user.icon}
                isTiny={true}
                outlineColor={color as PlayerColor}
            />

            <section className="flex flex-col gap-[9px] items-start">
                <TextTile className={textColor}>{user.name}</TextTile>
                <TextTile>
                    {playerPoints}{' '}
                    <SVG icon={Icon.points} fill="fill-custom-gray-400" />
                </TextTile>
            </section>
        </div>
    );
}

function TextTile({
    className,
    children,
}: PropsWithChildren<{className?: string}>) {
    return (
        <div
            className={`
            py-2 px-6 text-gray-400 font-bold
            flex gap-1 items-center w-fit
            border-t border-b-2 rounded-[20px]
            bg-light-default-bottom border-t-custom-gray-700 border-b-custom-gray-800

            ${className}
        `}>
            {children}
        </div>
    );
}

function ControlsHUD() {
    const {setAction, action} = useInterfaceState();
    const {showPopup} = usePopup();

    const areActionsBlocked = action !== 'none';

    return (
        <div className="grow flex align-center justify-between p-4">
            <div>
                <Button
                    icon={Icon.cogs}
                    className="pointer-events-auto"
                    onClick={() =>
                        showPopup('settings', {
                            title: 'Settings',
                            showExit: true,
                        })
                    }
                />
            </div>

            <div className="flex gap-4">
                <Button
                    icon={Icon.rotateLeft}
                    className="pointer-events-auto"
                    blocked={areActionsBlocked}
                    onClick={() => setAction('rotate_neg')}
                />
                <Button
                    icon={Icon.mirror}
                    className="pointer-events-auto"
                    blocked={areActionsBlocked}
                    onClick={() => setAction('flip')}
                />
                <Button
                    icon={Icon.rotateRight}
                    className="pointer-events-auto"
                    blocked={areActionsBlocked}
                    onClick={() => setAction('rotate_pos')}
                />
            </div>

            <div></div>
        </div>
    );
}

type GameEndScreenProps = {
    isWin: boolean;
};

function GameEndScreen({isWin}: GameEndScreenProps) {
    return (
        <div className="fixed z-50 inset-0 left-1/2 top-1/2">
            <div
                className="
                relative -translate-y-1/2 -translate-x-1/2
                shadow-2xl shadow-black

                flex flex-col gap-12 items-center

                w-[600px]
                rounded-[40px]
                text-bold text-custom-gray-400

                pt-16 pb-20 px-12

                border-t
                border-b-2
                bg-light-default-bottom border-t-custom-gray-700 border-b-custom-gray-800
                ">
                <p className="text-bold text-pink-50 text-6xl">
                    YOU {isWin ? 'WIN' : 'LOSE'}
                </p>
                <Button
                    text="Continue"
                    icon={Icon.play}
                    className="pointer-events-auto"
                />
            </div>
        </div>
    );
}

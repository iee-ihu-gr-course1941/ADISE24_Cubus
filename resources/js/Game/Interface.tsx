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
import {PropsWithChildren, useEffect, useMemo, useState} from 'react';
import {Loading} from './Loading';
import {COLORS} from '@/Constants/colors';
import {usePlayerRank} from '@/Hooks/usePlayerRank';

export const Interface = () => {
    const ui_state = useBoardState(state => state.gameState.ui_state);

    const gameHasFinished = useBoardState(
        state => state.gameState.ui_state === 'Finished',
    );
    const playerHasFinished = useBoardState(s => s.getHasFinished);
    const {time} = useTimerStore();

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col overflow-hidden">
            <PopupContainer className="pointer-events-auto" />
            <PlayersHUD />
            <GameStateFeedback />
            <div className="flex items-end grow">
                <ControlsHUD />
            </div>
            {gameHasFinished ? (
                <GameEndScreen />
            ) : playerHasFinished() ? (
                <GameFinishedMessage />
            ) : null}
            <StartingTimer />
        </div>
    );
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

const GameStateFeedback = () => {
    const ui_state = useBoardState(s => s.gameState.ui_state);
    return (
        <div className="p-4">
            <TextTile className="">
                <p className="text-base">
                    {ui_state === 'OwnTurnPlaying'
                        ? 'Your Turn'
                        : ui_state === 'OwnTurnLocked'
                          ? 'Checking move...'
                          : ui_state === 'OpponentTurn'
                            ? 'Opponent Turn'
                            : ui_state === 'Ready'
                              ? 'Waiting...'
                              : ui_state === 'Starting'
                                ? 'Starting...'
                                : 'Finished'}
                </p>
            </TextTile>
        </div>
    );
};

function PlayersHUD() {
    const {currentSession} = useAppState();

    if (!currentSession) return;

    return (
        <div className="p-4 flex flex-col gap-2">
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
                    <SVG
                        icon={Icon.points}
                        size={14}
                        fill="fill-custom-gray-400"
                    />
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
            py-1 px-4 text-gray-400 font-bold text-xs
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
    const lockTurn = useBoardState(s => s.lockTurn);
    const move = useBoardState(s => s.move);
    const ui_state = useBoardState(s => s.gameState.ui_state);
    const {setAction, action} = useInterfaceState();
    const showPopup = usePopup(s => s.showPopup);

    const areActionsBlocked =
        action !== 'none' || ui_state !== 'OwnTurnPlaying' || !move;

    return (
        <div className="grow flex items-end justify-between p-4">
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

            <div className="flex flex-col gap-4 justify-end items-center">
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

                <Button
                    text="End Turn"
                    className="w-full justify-center"
                    blocked={areActionsBlocked}
                    onClick={() => lockTurn()}
                />
            </div>

            <div></div>
        </div>
    );
}

function GameFinishedMessage() {
    const [showMessage, setShowMessage] = useState(true);
    const {currentSession} = useAppState();
    const points =
        (currentSession?.[
            `player_${currentSession.current_playing}_points` as keyof GameSession
        ] as number) ?? 0;
    if (showMessage) {
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
                    <p className="text-bold text-pink-50 text-3xl">
                        You have scored{' '}
                        <span className="text-custom-purple-400">{points}</span>{' '}
                        points!
                    </p>
                    <div className="flex gap-x-4">
                        <Button
                            onClick={() => setShowMessage(false)}
                            text="Spectate"
                            icon={Icon.see}
                            className="pointer-events-auto"
                        />
                        <Button
                            text="Play Again"
                            icon={Icon.play}
                            className="pointer-events-auto"
                            onClick={() => window.open(route('index'), '_self')}
                        />
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}

function GameEndScreen() {
    const {rank, isWin} = usePlayerRank();
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
                    {isWin ? (
                        <>
                            YOU <span className="text-green-500">WIN</span>
                        </>
                    ) : (
                        <>
                            You placed{' '}
                            <span
                                className={`${rank === 2 ? 'text-[#C0C0C0]' : rank === 3 ? 'text-[#CD7F32]' : 'text-[#D3D3D3]'}`}>
                                {rank +
                                    `${rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'}`}
                            </span>
                        </>
                    )}
                </p>
                <Button
                    onClick={() => window.open(route('index'), '_self')}
                    text="Continue"
                    icon={Icon.play}
                    className="pointer-events-auto"
                />
            </div>
        </div>
    );
}

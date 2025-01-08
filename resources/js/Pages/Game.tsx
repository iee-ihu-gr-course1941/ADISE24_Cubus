import useUserEvents from '@/Connection/useUserEvents';
import { Experience } from "@/Game/Experience";
import { Portrait } from '@/Icons/Portrait';
import { Icon, SVG } from '@/Icons/SVG';
import { Button } from '@/Inputs/Button';
import { List, ListElement } from '@/Inputs/List';
import Network from '@/network';
import { PopupContainer, usePopup } from '@/Popup';
import { useAppState } from '@/Store/app_state';
import { PageProps } from '@/types';
import { ConnectionState } from '@/types/connection';
import { GameResponse } from '@/types/game';
import { GameSession } from '@/types/models/tables/Session';
import { User } from '@/types/models/tables/User';
import { PropsWithChildren, useEffect } from 'react';

type GameProps = PageProps<{
    user: User;
    userSession?: GameResponse;
    availableSessions?: GameSession[];
}>;

export default function Game({ user, availableSessions, userSession, flash }: GameProps) {
    let { connectionState, currentSession, joinGame } = useUserEvents();
    let { currentSession: appSession, setUser, setCurrentSession } = useAppState();

    const session = currentSession?.session ?? userSession?.session ?? appSession;

    console.info('Initial server data:', {user, session, availableSessions});

    useEffect(() => {
        setUser(user);

        if(appSession == null && session != null) setCurrentSession(session);
        if(session != null) joinGame();
    }, [session])

    if(!session) return <Lobby user={user} availableSessions={availableSessions} connectionState={connectionState} serverMessage={flash} />;
    return <Experience/>;
}

type LobbyProps = {
    user: User;
    connectionState: ConnectionState;
    availableSessions?: GameSession[];
    serverMessage?: string;
};

function Lobby({ user, connectionState, availableSessions, serverMessage }: LobbyProps) {
    const { showPopup } = usePopup();

    useEffect(() => {
        if(serverMessage && serverMessage === 'user_new' || user && (user.icon == null || user.icon.length === 0)) {
            showPopup('user-settings', { title: 'Create Your Profile', denyExit: true });
        }
    }, []);

    return (
        <div className="w-screen h-screen bg-backdrop relative text-custom-gray-400 font-bold flex flex-col">
            <PopupContainer />
            <section className="pt-8 px-8 flex gap-8 grow items-start">
                <LobbiesControls games={availableSessions} />
                <PlayerDetails username={user.name ?? ''} icon='/portraits/white-wizard.jpg' points={3} />
            </section>

            <footer className="flex items-center gap-2 p-8">
                <Button icon={Icon.cogs} />
                <Button icon={Icon.info} onClick={() => showPopup('credits', { title: 'Credits', showExit: true })} />
                <Button text="Give us a Star" icon={Icon.github} isLeft={true} onClick={() => window.open('https://github.com/iee-ihu-gr-course1941/ADISE24_Cubus', '_blank')}/>

                <p className="ml-auto">Server Status: &nbsp;
                    <span className={`${connectionState === 'connected' ? 'text-green-400' : 'text-custom-brown-500' }`}>
                        {connectionState}
                    </span>
                </p>
            </footer>
        </div>
    );
}

type LobbiesControlsProps = {
    games?: GameSession[];
};

function LobbiesControls({ games }: LobbiesControlsProps) {
    const { showPopup } = usePopup();
    const { setCurrentSession } = useAppState();

    async function joinRandomGameCallback() {
        let response = await Network.get<GameSession>({ url: route('lobby.match')});
        if(!response) return;
        setCurrentSession(response);
    }

    async function joinGameCallback(gameId: string) {
        let response = await Network.get<GameSession>({ url: route('lobby.join', gameId)});
        if(!response) return;
        setCurrentSession(response);
    }

    return (
        <section className="flex flex-col gap-4 grow h-full">
            <header className="flex gap gap-4">
                <Button text="Create Game" icon={Icon.largeStars} onClick={() => showPopup('lobby-settings', { title: 'Create Lobby', showExit: true })} />
                <Button text="Join Random" icon={Icon.random} onClick={joinRandomGameCallback} />
            </header>

            <List title="Available Games" emptyText="No Games Available" maxListHeight='70vh' className="w-full max-w-[980px] h-full" onClick={joinGameCallback}>
                {
                    games && games.length > 0 &&
                        games.map(game => (
                            <ListElement key={game?.id} value={game?.id?.toString() ?? ''}>
                                <div className="group px-8 py-4 flex items-center gap-4 w-full hover:bg-custom-purple-400 hover:text-custom-pink-50">
                                    <p className="grow text-start">{game.name}</p>
                                    <div className="flex gap-2 items-center"><SVG icon={Icon.crown} fill="fill-custom-gray-400 group-hover:fill-custom-pink-50" /><p>by {game.player_host?.name}</p></div>
                                    <div className="flex gap-2 items-center"><SVG icon={Icon.users} fill="fill-custom-gray-400 group-hover:fill-custom-pink-50" /><p>{game.current_player_count} of {game.player_count}</p></div>
                                </div>
                            </ListElement>
                        ))
                }
            </List>
        </section>
    );
}

type PlayerDetailsProps = {
    username: string,
    icon: string,
    points: number,
};

function PlayerDetails({}: PlayerDetailsProps) {
    const { user } = useAppState();
    const { showPopup } = usePopup();

    if(user == null) return;

    return (
        <div className="flex gap-4 items-start">
            <section className="flex flex-col gap-[9px] items-end">
                <TextTile>{user.name}</TextTile>
                <TextTile>10 <SVG icon={Icon.points} fill='fill-custom-gray-400' /></TextTile>
                <Button icon={Icon.editProfile} onClick={() => showPopup('user-settings', { title: 'Edit Your Profile', showExit: true })} />
            </section>

            <Portrait url={user.icon} />
        </div>
    )
}

function TextTile({className, children}: PropsWithChildren<{className?: string}>) {
    return (
        <div className={`
            py-2 px-6
            flex gap-1 items-center w-fit
            border-t border-b-2 rounded-[20px]
            bg-light-default-bottom border-t-custom-gray-700 border-b-custom-gray-800

            ${className}
        `} >{children}</div>
    );
}

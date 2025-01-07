import useUserEvents from '@/Connection/useUserEvents';
import { Experience } from "@/Game/Experience";
import { Portrait } from '@/Icons/Portrait';
import { Icon, SVG } from '@/Icons/SVG';
import { Button } from '@/Inputs/Button';
import { List, ListElement } from '@/Inputs/List';
import { PopupContainer, usePopup } from '@/Popup';
import { useAppState } from '@/Store/app_state';
import { PageProps } from '@/types';
import { ConnectionState } from '@/types/connection';
import { GameResponse } from '@/types/game';
import { User } from '@/types/models/tables/User';
import { PropsWithChildren, useEffect } from 'react';

type GameProps = PageProps<{
    user: User;
    userSession?: GameResponse
}>;

export default function Game({ user, userSession, flash }: GameProps) {
    let { connectionState, currentSession, joinGame } = useUserEvents();
    let { setUser } = useAppState();
    const session = currentSession ?? userSession;

    console.info('Initial server data:', {user, session});

    useEffect(() => {
        setUser(user);

        if(session != null) joinGame();
    }, [])

    if(!session) return <Lobby user={user} connectionState={connectionState} serverMessage={flash} />;
    return <Experience/>;
}

type LobbyProps = {
    user: User;
    connectionState: ConnectionState;
    serverMessage?: string;
};

function Lobby({ user, connectionState, serverMessage }: LobbyProps) {
    const { showPopup } = usePopup();

    useEffect(() => {
        if(serverMessage && serverMessage === 'user_new') {
            showPopup('user-settings', { title: 'Create Your Profile', denyExit: true });
        }
    }, []);

    return (
        <div className="w-screen h-screen bg-backdrop relative text-custom-gray-400 font-bold flex flex-col">
            <PopupContainer />
            <section className="pt-8 px-8 flex gap-8 grow items-start">
                <LobbiesControls />
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
    games?: Array<{id: number}>;
};

function LobbiesControls({ games }: LobbiesControlsProps) {
    return (
        <section className="flex flex-col gap-4 grow h-full">
            <header className="flex gap gap-4">
                <Button text="Create Game" icon={Icon.largeStars} />
                <Button text="Join Random" icon={Icon.random} />
            </header>

            <List title="Available Games" maxListHeight='70vh' className="w-full max-w-[980px] h-full" onClick={(id) => console.info('Joining Game:', id)}>
                {
                    games == null || games.length === 0 ?
                        <div className="w-full text-center pt-16">No Games Available</div> :
                        games.map(game => (
                            <ListElement key={game.id} value={game.id.toString()}>
                                <div className="group px-8 py-4 flex items-center gap-4 w-full hover:bg-custom-purple-400 hover:text-custom-pink-50">
                                    <p className="grow text-start">Game {game.id}</p>
                                    <div className="flex gap-2 items-center"><SVG icon={Icon.crown} fill="fill-custom-gray-400 group-hover:fill-custom-pink-50" /><p>by Player</p></div>
                                    <div className="flex gap-2 items-center"><SVG icon={Icon.users} fill="fill-custom-gray-400 group-hover:fill-custom-pink-50" /><p>1 of 2</p></div>
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

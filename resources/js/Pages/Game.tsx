import useUserEvents from '@/Connection/useUserEvents';
import { Experience } from "@/Game/Experience";
import { Portrait } from '@/Icons/Portrait';
import { Icon, SVG } from '@/Icons/SVG';
import { Button } from '@/Inputs/Button';
import { PageProps } from '@/types';
import { ConnectionState } from '@/types/connection';
import { GameResponse } from '@/types/game';
import { User } from '@/types/models/tables/User';
import { PropsWithChildren, useEffect } from 'react';

type GameProps = PageProps<{
    user: User;
    userSession?: GameResponse
}>;

export default function Game({ user, userSession }: GameProps) {
    let { connectionState, currentSession, joinGame } = useUserEvents();
    const session = currentSession ?? userSession;

    console.info('Initial server data:', {user, session});

    useEffect(() => {
        if(session != null) joinGame();
    }, [])

    if(!session) return <Lobby user={user} connectionState={connectionState} />;
    return <Experience/>;
}

type LobbyProps = {
    user: User;
    connectionState: ConnectionState;
};

function Lobby({ user, connectionState }: LobbyProps) {
    return (
        <div className="w-screen h-screen bg-backdrop relative text-custom-gray-400 font-bold flex flex-col">
            <section className="pt-8 px-8 flex gap-8 grow items-start">
                <LobbiesControls />
                <PlayerDetails username={user.name ?? ''} icon='/portraits/white-wizard.jpg' points={3} />
            </section>

            <footer className="flex items-center gap-2 p-8">
                <Button icon={Icon.cogs} />
                <Button icon={Icon.info} />
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

function LobbiesControls() {
    return (
        <div className="flex flex-col gap-4 grow">
            Hi
        </div>
    );
}

type PlayerDetailsProps = {
    username: string,
    icon: string,
    points: number,
};

function PlayerDetails({username, icon, points}: PlayerDetailsProps) {
    return (
        <div className="flex gap-4 items-start">
            <section className="flex flex-col gap-[9px] items-end">
                <TextTile>{username}</TextTile>
                <TextTile>{points} <SVG icon={Icon.points} fill='fill-custom-gray-400' /></TextTile>
                <Button icon={Icon.editProfile} />
            </section>

            <Portrait url={icon} />
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

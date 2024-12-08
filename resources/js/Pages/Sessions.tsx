import useUserEvents from '@/Connection/useUserEvents';
import { PageProps } from '@/types';
import { Game_session } from '@/types/models/tables/Session';
import { User } from '@/types/models/tables/User';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Sessions({ user, userSession, sessions, flash }: PageProps<{ user: User, userSession?: Game_session, sessions: Game_session[] }>) {
    let { connectionState, joinGame, currentSession } = useUserEvents();

    useEffect(() => {
        const session = currentSession ?? userSession;
        if(!session) return;

        if(session.session_state === 'playing' || session.session_state === 'paused') {
            router.visit(route('game'));
        }
    }, [currentSession]);

    useEffect(() => {
        if(!userSession) return;
        joinGame(userSession.id.toString());
    }, []);

    let UserData = () => (
        <div>
            <h2 className="font-black text-xl">User Info</h2>
            <p>{ user.name }</p>
            {
                user.icon && (
                    <div>
                        <p>Icon Preview</p>
                        <img src={user.icon} className='object-cover w-[128px] h-[128px]' />
                    </div>
                )
            }

            <a href={route('logout')}>Logout</a>
        </div>
    );

    return (
        <div className='p-8'>
            <div className='pb-16'>
                <h1 className='font-black text-3xl'>Lord of the Rings Card Game</h1>
                <p>Connection: {connectionState}</p>
                { user && <UserData /> }
            </div>

            {
                flash &&
                <div>
                    <p className='text-red-500'>{ flash }</p>
                </div>
            }

            <div>
                <a href={route('lobby.create')}>Create Game</a>
            </div>

            { userSession && <CurrentSessionVisualizer user={user} session={currentSession || userSession} /> }

            <p className='font-black text-lg'>Games</p>
            {
                sessions == null || sessions.length === 0 ? (
                    <p>No Games available right now</p>
                ) : sessions.map(session => (
                    <ul className='list-["-"] list-inside'>
                        {
                            <li><a href={route('lobby.join', { 'game_session': session.id })}>Game {session.id}</a></li>
                        }
                    </ul>
                ))
            }
        </div>
    );
}

function CurrentSessionVisualizer({ user, session }: { user?: User, session: Game_session }) {
    return (
        <div className='bg-slate-100 w-fit rounded-md p-4'>
            <p className='font-bold text-lg'>Your game</p>
            <p>Session id: {session.id}</p>
            <p>Session state: {session.session_state}</p>

            <p className='font-bold text-md'>Players</p>
            <ul>
                { session.player_blue && <li className='text-blue-400'>{ session.player_blue!.name }</li> }
                { session.player_red && <li className='text-red-400'>{ session.player_red!.name }</li> }
                { session.player_green && <li className='text-green-400'>{ session.player_green!.name }</li> }
                { session.player_yellow && <li className='text-yellow-400'>{ session.player_yellow!.name }</li> }
            </ul>
        </div>
    );
}

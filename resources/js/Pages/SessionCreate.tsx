import useUserEvents from '@/Connection/useUserEvents';
import { PageProps } from '@/types';
import { User } from '@/types/models/tables/User';
import { useForm } from '@inertiajs/react';

export default function Sessions({ user }: PageProps<{ user: User }>) {
    let { connectionState } = useUserEvents();
    let { post } = useForm({});

    function onCreateGame() {
        post(route('lobby.store'));
    }

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

            <p className='font-black text-lg'>Create Game</p>
            <p className='italic'>Some valid options could be the player count (2, 4) maybe a name for the lobby potentially a password for rooms to not be publically available etc...</p>

            <button onClick={onCreateGame}>Create Game</button>
        </div>
    );
}

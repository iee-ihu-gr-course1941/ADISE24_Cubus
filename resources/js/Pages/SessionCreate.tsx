import useUserEvents from '@/Connection/useUserEvents';
import { PageProps } from '@/types';
import { User } from '@/types/models/tables/User';
import { useForm } from '@inertiajs/react';

export default function Sessions({ user }: PageProps<{ user: User }>) {
    let { connectionState } = useUserEvents();
    let { post, data, setData, errors } = useForm({
        'player_count': 4,
    });

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

            <div className='flex gap-2 items-center'>
                <label htmlFor='player-count'>Player Count</label>
                <input name='player-count' placeholder='4' value={data.player_count} onChange={(e) => setData('player_count', (parseInt(e.target.value) || 4))} />
                { errors.player_count && <p className='text-red-400'>{ errors.player_count }</p> }
            </div>

            <button onClick={onCreateGame}>Create Game</button>
        </div>
    );
}

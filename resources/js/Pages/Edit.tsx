import useUserEvents from '@/Connection/useUserEvents';
import { PageProps } from '@/types';
import { User } from '@/types/models/tables/User';
import { useForm } from '@inertiajs/react';

export default function Welcome({ user, isNew }: PageProps<{ user: User, isNew: boolean }>) {
    let { connectionState } = useUserEvents();
    let { data, setData, post, errors } = useForm({
        name: user?.name ?? '',
        icon: user?.icon ?? '',
    });

    function onSave() {
        post(route('profile.store'));
    }

    return (
        <div className='p-8'>
            <div className='pb-16'>
                <h1 className='font-black text-3xl'>{ isNew ? 'Create' : 'Edit' } User</h1>
                <p>Connection: {connectionState}</p>
            </div>

                <div className='flex flex-col items-start'>
                    <label htmlFor='name'>Username</label>
                    <input name='name' value={data.name} onChange={(event) => setData('name', event.target.value)} />
                    { errors.name && <p>{errors.name}</p> }

                    <label htmlFor='icon'>Icon</label>
                    <input name='icon' value={data.icon} onChange={(event) => setData('icon', event.target.value)} />
                    { errors.icon && <p>{errors.icon}</p> }

                    {
                        data.icon && (
                            <div>
                                <p>Icon Preview</p>
                                <img src={data.icon} className='object-cover w-[128px] h-[128px]' />
                            </div>
                        )
                    }

                    <button onClick={onSave}>Save</button>
                </div>
        </div>
    );
}

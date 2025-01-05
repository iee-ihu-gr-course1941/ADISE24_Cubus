import useUserEvents from '@/Connection/useUserEvents';
import { Experience } from "@/Game/Experience";
import { Game_session } from '@/types/models/tables/Session';
import { User } from '@/types/models/tables/User';

export default function Game({ user, sessions, flash }: PageProps<{ user: User, userSession?: Game_session }>) {
    let { connectionState, currentSession } = useUserEvents();

    return (
        <Experience/>
    );
}

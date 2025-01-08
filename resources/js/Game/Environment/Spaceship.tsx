import {useLoadedModels} from '@/Hooks/useLoadedModels';
import {memo} from 'react';
import {SpaceshipPlayerColors} from './SpaceshipPlayerColors';

export const Spaceship = memo(() => {
    const models = useLoadedModels();

    return (
        <>
            {models.board && <primitive object={models.board} />}
            <SpaceshipPlayerColors playerColor="red" />
        </>
    );
});

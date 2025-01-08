import {useLoadedModels} from '@/Hooks/useLoadedModels';
import {memo} from 'react';
import {SpaceshipPlayerColors} from './SpaceshipPlayerColors';
import {SpaceshipAirModules} from './SpaceshipAirModules';
import { SpaceshipEngines } from './SpaceshipEngines';

export const Spaceship = memo(() => {
    const models = useLoadedModels();

    return (
        <>
            {models.board && <primitive object={models.board} />}
            <SpaceshipAirModules />
            <SpaceshipPlayerColors playerColor="red" />
            <SpaceshipEngines/>
        </>
    );
});

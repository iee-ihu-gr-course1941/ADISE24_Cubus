import {memo} from 'react';
import {SpaceshipPlayerColors} from './SpaceshipPlayerColors';
import {SpaceshipAirModules} from './SpaceshipAirModules';
import {SpaceshipEngines} from './SpaceshipEngines';
import {Float} from '@react-three/drei';
import {useBoardState} from '@/Store/board_state';
import {PlayerModels} from './PlayerModels';
import {useLoadedModels} from '@/Store/models_state';

export const Spaceship = memo(() => {
    const playerColor = useBoardState(s => s.playerState?.session_color);

    return (
        <>
            <SpaceshipModel />
            <SpaceshipAirModules />
            <SpaceshipPlayerColors playerColor={playerColor} />
            <SpaceshipEngines />
            <PlayerModels />
        </>
    );
});

const SpaceshipModel = memo(() => {
    const spaceship = useLoadedModels(s => s.models.spaceship);
    if (!spaceship) return null;
    else return <primitive object={spaceship} />;
});

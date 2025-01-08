import {useLoadedModels} from '@/Hooks/useLoadedModels';
import {memo} from 'react';
import {SpaceshipPlayerColors} from './SpaceshipPlayerColors';
import {SpaceshipAirModules} from './SpaceshipAirModules';
import { SpaceshipEngines } from './SpaceshipEngines';
import { Float } from '@react-three/drei';
import { useBoardState } from '@/Store/board_state';

export const Spaceship = memo(() => {
    const models = useLoadedModels();
    const playerColor = useBoardState(s => s.playerState?.session_color)

    return (
        <>
                {models.board && <primitive object={models.board} />}
                <SpaceshipAirModules />
                <SpaceshipPlayerColors playerColor={playerColor} />
                <SpaceshipEngines/>
        </>
    );
});

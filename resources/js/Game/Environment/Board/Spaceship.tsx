import {memo, useMemo} from 'react';
import {SpaceshipPlayerColors} from './SpaceshipPlayerColors';
import {SpaceshipAirModules} from './SpaceshipAirModules';
import {SpaceshipEngines} from './SpaceshipEngines';
import {useBoardState} from '@/Store/board_state';
import {PlayerModels} from './PlayerModels';
import {useLoadedModels} from '@/Store/models_state';
import {SpaceshipModels} from './SpaceshipModels';

export const Spaceship = memo(() => {
    const playerColor = useBoardState(s => s.playerState?.session_color);
    const isGameOnGoing = useBoardState(s => s.isGameOnGoing);
    const ui_state = useBoardState(s => s.gameState.ui_state);

    const Models = useMemo(() => {
        return (
            <>
                <SpaceshipModel />
                <SpaceshipAirModules />
                <SpaceshipEngines />
                <PlayerModels />
            </>
        );
    }, []);

    return (
        <>
            {Models}
            <SpaceshipPlayerColors playerColor={playerColor} />
            {isGameOnGoing() && <SpaceshipModels />}
        </>
    );
});

const SpaceshipModel = () => {
    const spaceship = useLoadedModels(s => s.models.spaceship);
    if (!spaceship) return null;
    else {
        return <primitive object={spaceship} />;
    }
};

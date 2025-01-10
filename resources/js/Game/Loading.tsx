import {loadModels} from '@/Hooks/loadModels';
import {useBoardState} from '@/Store/board_state';
import {useLoadedModels} from '@/Store/models_state';
import {memo, useEffect} from 'react';

export const Loading = memo(() => {
    const startGame = useBoardState(s => s.startGame);
    /*
     * Load Models
     */
    loadModels();
    const hasLoaded = useLoadedModels(s => s.hasLoaded);

    useEffect(() => {
        if (hasLoaded) {
            setTimeout(() => {
                startGame();
            }, 250);
        }
    }, [hasLoaded]);
    return <></>;
});

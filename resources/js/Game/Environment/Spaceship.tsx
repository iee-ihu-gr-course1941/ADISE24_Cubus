import {useLoadedMaterials} from '@/Hooks/useLoadedMaterials';
import {useLoadedModels} from '@/Hooks/useLoadedModels';
import {memo} from 'react';

export const Spaceship = memo(() => {
    const models = useLoadedModels();

    return <>{models.board && <primitive object={models.board} />}</>;
});

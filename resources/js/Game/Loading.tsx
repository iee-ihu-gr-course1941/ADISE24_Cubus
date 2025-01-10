import {loadModels} from '@/Hooks/loadModels';
import {useBoardState} from '@/Store/board_state';
import {useLoadedModels} from '@/Store/models_state';
import {useProgress} from '@react-three/drei';
import {memo, useEffect, useRef} from 'react';

export const Loading = memo(() => {
    const hasLoaded = useLoadedModels(s => s.hasLoaded);
    const startGame = useBoardState(s => s.startGame);
    /*
     * Load Models
     */
    loadModels();
    console.log('rendering loading', hasLoaded);
    useEffect(() => {
        if (hasLoaded) {
            setTimeout(() => {
                startGame();
            }, 250);
        }
    }, [hasLoaded]);
    if (!hasLoaded) {
        return <LoadingIndicator />;
    } else {
        return null;
    }
});

const LoadingIndicator = () => {
    const loadingRef = useRef<HTMLDivElement>(null);
    const {progress} = useProgress();
    useEffect(() => {
        if (loadingRef.current) {
            loadingRef.current.style.width = `${progress}%`;
        }
    }, [loadingRef, progress]);
    return (
        <div className="absolute w-full left-0 flex justify-center items-center top-[40%] text-center flex-col gap-y-2">
            <p className="text-white text-xl">
                We are getting everything ready...
            </p>
            <div className="w-[40%] h-[2px]">
                <div
                    ref={loadingRef}
                    className="w-0 h-full bg-white transition-all duration-500"></div>
            </div>
        </div>
    );
};

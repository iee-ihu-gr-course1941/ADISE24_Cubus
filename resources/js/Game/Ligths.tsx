import { useBoardState } from "@/Store/board_state";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import { useMemo } from "react";
import { AdditiveBlending } from "three";

export const Lights = () => {

    const isGameOnGoing = useBoardState(s => s.isGameOnGoing);
    const ui_state = useBoardState(s => s.gameState.ui_state);

    const {opacity, intensity} = useMemo(() => {
        const isLowOrbit = isGameOnGoing();
        if(isLowOrbit){
            return {
                opacity: 0.45,
                intensity: 4,
            }
        }else{
            return {
                opacity: 1.0,
                intensity: 6.0,
            }
        }

    }, [ui_state])
    return (
        <>
            <ambientLight intensity={0.15} />
            <directionalLight position={[0, 10, 5]} intensity={0.6} />
            <EffectComposer>
                <Bloom opacity={opacity} intensity={intensity}  luminanceThreshold={1}/>
            </EffectComposer>
        </>
    );
};

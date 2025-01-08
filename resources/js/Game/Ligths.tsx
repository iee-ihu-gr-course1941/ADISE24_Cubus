import { useBoardState } from "@/Store/board_state";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import { useMemo } from "react";
import { AdditiveBlending } from "three";

export const Lights = () => {
    // const {intensity, opacity} = useControls({
    //     intensity: {
    //         value: 10.0,
    //         min: 0,
    //         max: 10,
    //         step: 0.01
    //     },
    //     opacity: {
    //         value: 0.45,
    //         min: 0,
    //         max: 1,
    //         step: 0.01
    //     }

    // })
    const ui_state = useBoardState(s => s.gameState.ui_state);
        const {opacity, intensity} = useMemo(() => {

            const isLowOrbit = ui_state === 'OpponentTurn' || ui_state === 'OwnTurnLocked' || ui_state === 'OwnTurnPlaying';
            if(isLowOrbit){
                return {
                    opacity: 0.45,
                    intensity: 10,
                }
            }else{
                return {
                    opacity: 1.0,
                    intensity: 10.0,
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

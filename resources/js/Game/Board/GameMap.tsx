import { useThree } from "@react-three/fiber";
import { Lights } from "../Ligths";
import { Board } from "./Board";
import Hand from "./Hand";
import { useEffect } from "react";
import { useControls } from "leva";
import { useBoardState } from "@/Store/board_state";

const GameMap = () => {

    const {y,z} = useControls({
        y: {
            label: 'Camera Y',
            value: 9.5,
            min: 0,
            max: 30,
            step: 0.1,
        },
        z: {
            label: 'Camera Z',
            value: 8.3,
            min: 0,
            max: 30,
            step: 0.1,
        },
    })

    const {camera} = useThree();

    useEffect(() => {

        camera.position.set(0, y, z);
        camera.updateProjectionMatrix()

    }, [y,z])

    const playerIdentifier = useBoardState(state => state.gameState.player_identifier);

    return (
        <>
            <Lights/>
            <Board/>
            {playerIdentifier && <Hand/>}
        </>
    )

}

export default GameMap;

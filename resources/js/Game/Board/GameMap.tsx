import { useThree } from "@react-three/fiber";
import { Lights } from "../Ligths";
import { Board } from "./Board";
import Hand from "./Hand";
import { useEffect } from "react";
import { useControls } from "leva";

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

    return (
        <>
            <Lights/>
            <Board/>
            <Hand/>
        </>
    )

}

export default GameMap;

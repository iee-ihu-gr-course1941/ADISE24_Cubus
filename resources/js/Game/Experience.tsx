import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Board } from "./Board/Board";
import { Lights } from "./Ligths";
import { Perf } from "r3f-perf"

export const Experience = () => {
    return (
        <Canvas camera={{
            fov: 60,
            near: 0.1,
            far: 200,
            position: [-1.5, 2, 10],
          }}>
            <OrbitControls makeDefault/>
            <color attach={'background'} args={['#535353']} />
            <Lights/>
            <Board/>
            <Perf position="top-left"/>
        </Canvas>
    );
}

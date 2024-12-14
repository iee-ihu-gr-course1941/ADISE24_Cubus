import { OrbitControls } from "@react-three/drei";
import { Camera, Canvas, Object3DNode, useThree } from "@react-three/fiber";
import { Board } from "./Board/Board";
import { Lights } from "./Ligths";
import { Perf } from "r3f-perf"
import { memo, useEffect, useMemo, useRef } from "react";
import GameMap from "./Board/GameMap";
import { Interface } from "./Interface";
import { BoardControls } from "./Board/BoardControls";
import * as THREE from "three";

const INITIAL_CAMERA_PROPS = {
    fov: 60,
    near: 0.1,
    far: 200,
    position: new THREE.Vector3,
}

export const Experience = memo(
    () => {
        return (
            <>
                <Canvas
                camera={INITIAL_CAMERA_PROPS}>
                    <color attach={'background'} args={['#535353']} />
                    <Perf position="top-left"/>
                    <BoardControls/>
                    <GameMap/>
                </Canvas>
                <Interface/>
            </>
        );
    }
);

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
import { ORIGIN_CAMERA_LOOK_AT, ORIGIN_CAMERA_POSITION } from "@/Constants/camera";

const INITIAL_CAMERA_PROPS = {
    fov: 85,
    near: 0.1,
    far: 200,
}

export const Experience = memo(
    () => {
        return (
            <>
                <Canvas
                onCreated={({camera}) => {
                    camera.position.set(ORIGIN_CAMERA_POSITION.x, ORIGIN_CAMERA_POSITION.y, ORIGIN_CAMERA_POSITION.z);
                    camera.lookAt(ORIGIN_CAMERA_LOOK_AT.x, ORIGIN_CAMERA_LOOK_AT.y, ORIGIN_CAMERA_LOOK_AT.z);
                }}
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

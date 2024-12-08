import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export const Experience = () => {
    return (
        <Canvas camera={{
            fov: 60,
            near: 0.1,
            far: 200,
            position: [-1.5, 2, 10],
          }}>
            <OrbitControls/>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={0.5} />
            <color attach={'background'} args={['#171717']} />
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
        </Canvas>
    );
}

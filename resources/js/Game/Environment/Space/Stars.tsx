import {memo, useEffect, useMemo, useRef} from 'react';
import vertexShader from '../../../../shaders/space/stars/vertex.glsl';
import fragmentShader from '../../../../shaders/space/stars/fragment.glsl';
import * as THREE from 'three';
import {extend, useFrame, useThree} from '@react-three/fiber';
import {shaderMaterial} from '@react-three/drei';

const SpaceStarsMaterial = shaderMaterial(
    {
        uTime: 0,
        uResolution: new THREE.Vector2(),
        uSize: 20,
        uGlowIntensity: 0,
    },
    vertexShader,
    fragmentShader,
);

extend({SpaceStarsMaterial});

export const Stars = memo(() => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta;
        }
    });

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uSize.value = 14;
        }
    }, [materialRef]);

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.blending = THREE.AdditiveBlending;
            materialRef.current.transparent = true;
            materialRef.current.depthWrite = false;
        }
    }, [materialRef]);

    const geometry = useMemo(() => {
        const parameters = {
            count: 4000,
            insideColor: 0x0d0221,
            outsideColor: 0xd8bfd8,
            radius: 160,
        };
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);
        const randoms = new Float32Array(parameters.count);
        const glow = new Float32Array(parameters.count);

        const insideColor = new THREE.Color(parameters.insideColor);
        const outsideColor = new THREE.Color(parameters.outsideColor);

        const excludedRadius = 20;
        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;

            let x = (Math.random() - 0.5) * parameters.radius;
            const y = (Math.random() - 0.4) * parameters.radius * 2;
            let z = (Math.random() - 0.5) * parameters.radius;

            const radius = Math.random() * parameters.radius;

            if (
                Math.abs(x) < excludedRadius &&
                Math.abs(z) < excludedRadius &&
                Math.abs(y) < excludedRadius * 2
            ) {
                const addedRadius = 2;
                x =
                    x < 0
                        ? x - excludedRadius + Math.random() * addedRadius
                        : x + excludedRadius - Math.random() * addedRadius;
                z =
                    z < 0
                        ? z - excludedRadius + Math.random() * addedRadius
                        : z + excludedRadius - Math.random() * addedRadius;
            }

            if (z < 10 && z > -30 && Math.abs(x) < 10) {
                z -= 40;
            }

            positions[i3 + 0] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            const mixedColor = insideColor.clone();
            mixedColor.lerp(outsideColor, radius / parameters.radius);

            colors[i3 + 0] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            randoms[i] = Math.random() * 6 + 2;
            glow[i] = Math.random() < 0.95 ? 0 : 1;
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3),
        );
        geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
        geometry.setAttribute(
            'aGlowIntensity',
            new THREE.BufferAttribute(glow, 1),
        );

        return geometry;
    }, []);

    return (
        <>
            <points>
                <bufferGeometry attach="geometry" {...geometry} />
                <spaceStarsMaterial ref={materialRef} />
            </points>
        </>
    );
});

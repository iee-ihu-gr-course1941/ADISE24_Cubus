import {useTexture} from '@react-three/drei';
import {useLoader, useThree} from '@react-three/fiber';
import {useControls} from 'leva';
import {useEffect, useState} from 'react';
import * as THREE from 'three';

export const useLoadedMaterials = () => {
    const [materials, setMaterials] = useState<
        Record<string, THREE.MeshStandardMaterial>
    >({});

    const metalTextures = useLoader(
        THREE.TextureLoader,
        [
            '/textures/spaceship/metal_color.png',
            '/textures/spaceship/metal_height.png',
            '/textures/spaceship/metal_ambient_occlusion.png',
            '/textures/spaceship/metal_roughness.png',
            '/textures/spaceship/metal_normal_dx.png',
            '/textures/spaceship/metal_metallic.png',
        ],
        texture => {
            console.log('loaded textures metal', texture);
        },
    );

    const metalRepeatScale = new THREE.Vector2(6, 6);
    metalTextures.forEach((texture, index) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat = metalRepeatScale;
        texture.flipY = true;
        texture.anisotropy = 8;

        if (index === 0) {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.magFilter = THREE.NearestFilter;
        }
    });

    useEffect(() => {
        if (metalTextures.length > 0 && !materials['metal']) {
            const material = new THREE.MeshStandardMaterial();
            material.map = metalTextures[0];
            material.displacementMap = metalTextures[1];
            material.aoMap = metalTextures[2];
            material.roughnessMap = metalTextures[3];
            material.normalMap = metalTextures[4];
            material.metalnessMap = metalTextures[5];
            material.displacementScale = 0.05;
            material.displacementBias = -0.05;
            material.side = THREE.DoubleSide;

            setMaterials(prev => ({...prev, metal: material}));
        }
    }, [metalTextures]);

    return materials;
};

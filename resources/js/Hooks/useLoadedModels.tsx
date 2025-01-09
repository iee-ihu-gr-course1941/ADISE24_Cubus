import {useGLTF} from '@react-three/drei';
import {memo, useEffect, useState} from 'react';
import * as THREE from 'three';
import {useLoadedMaterials} from './useLoadedMaterials';
import {useThree} from '@react-three/fiber';
import {PlayerColor} from '@/types/game';
import {COLORS} from '@/Constants/colors';

export type LoadedModels = {
    board?: THREE.Object3D;
    airModule?: THREE.Object3D;
    duck: {
        [key in PlayerColor]?: THREE.Object3D;
    };
};

export const useLoadedModels = () => {
    const [models, setModels] = useState<LoadedModels>({duck: {}});
    const boardScene = useGLTF('/models/environment/board.glb');
    const duckScene = useGLTF('/models/environment/duck.gltf');
    const materials = useLoadedMaterials();
    console.log('boardScene:', boardScene);
    console.log('duckScene:', duckScene);

    console.log(models);

    useEffect(() => {
        if (!models.board) {
            console.log('[ADDING MODEL] board');
            boardScene.scene.traverse(child => {
                if (child.name === 'spaceship' && child instanceof THREE.Mesh) {
                    console.log('found board');

                    child.rotation.set(3.14, 0, 0);
                    child.position.set(0, -1.5, 0);
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x64748b,
                        side: THREE.DoubleSide,
                    });
                    models.board = child;
                }
            });
        }
        if (!models.airModule) {
            console.log('[ADDING MODEL] air module');
            boardScene.scene.traverse(child => {
                if (child.name === 'air-1' && child instanceof THREE.Mesh) {
                    console.log('found air-1');
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0x00ff00,
                    });
                    models.airModule = child;
                }
            });
        }

        /**
         * * Add Duck Models for each player!
         */

        if (!models.duck?.green) {
            console.log('[ADDING MODEL] duck green');
            const duckSceneCloned = duckScene.scene.clone(true);
            duckSceneCloned.traverse(child => {
                if (
                    DUCK_NAMES.includes(child.name) &&
                    child instanceof THREE.Mesh
                ) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: COLORS['green'],
                        side: THREE.DoubleSide,
                    });
                }
            });
            models.duck.green = duckSceneCloned;
        }
        if (!models.duck?.red) {
            console.log('[ADDING MODEL] duck red');
            const duckSceneCloned = duckScene.scene.clone(true);
            duckSceneCloned.traverse(child => {
                if (
                    DUCK_NAMES.includes(child.name) &&
                    child instanceof THREE.Mesh
                ) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: COLORS['red'],
                        side: THREE.DoubleSide,
                    });
                }
            });
            models.duck.red = duckSceneCloned;
        }
        if (!models.duck?.blue) {
            console.log('[ADDING MODEL] duck blue');
            const duckSceneCloned = duckScene.scene.clone(true);
            duckSceneCloned.traverse(child => {
                if (
                    DUCK_NAMES.includes(child.name) &&
                    child instanceof THREE.Mesh
                ) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: COLORS['blue'],
                        side: THREE.DoubleSide,
                    });
                }
            });
            models.duck.blue = duckSceneCloned;
        }
        if (!models.duck?.yellow) {
            console.log('[ADDING MODEL] duck yellow');
            const duckSceneCloned = duckScene.scene.clone(true);
            duckSceneCloned.traverse(child => {
                if (
                    DUCK_NAMES.includes(child.name) &&
                    child instanceof THREE.Mesh
                ) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: COLORS['yellow'],
                        side: THREE.DoubleSide,
                    });
                }
            });
            models.duck.yellow = duckSceneCloned;
        }
    }, [boardScene, materials, duckScene]);

    return models;
};

const DUCK_NAMES = [
    'character_duck',
    'character_duckArmLeft',
    'character_duckArmRight',
];

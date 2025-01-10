import {useGLTF} from '@react-three/drei';
import {memo, useEffect, useState} from 'react';
import * as THREE from 'three';
import {COLORS} from '@/Constants/colors';
import {useLoadedModels} from '@/Store/models_state';

export const loadModels = () => {
    const spaceshipScene = useGLTF('/models/environment/board.glb');
    const duckScene = useGLTF('/models/environment/duck.gltf');
    console.log('boardScene:', spaceshipScene);
    console.log('duckScene:', duckScene);

    const addModel = useLoadedModels(s => s.addModel);
    const addDuckModel = useLoadedModels(s => s.addDuckModel);

    useEffect(() => {
        console.log('adding spaceshio', spaceshipScene);
        spaceshipScene.scene.traverse(child => {
            if (child.name === 'spaceship' && child instanceof THREE.Mesh) {
                console.log('found board');

                child.rotation.set(3.14, 0, 0);
                child.position.set(0, -1.5, 0);
                child.material = new THREE.MeshStandardMaterial({
                    color: 0x64748b,
                    side: THREE.DoubleSide,
                });
                addModel('spaceship', child);
            }
        });
    }, [spaceshipScene]);

    useEffect(() => {
        /**
         * * Add Duck Models for each player!
         */

        console.log('[ADDING MODEL] duck green');
        const duckSceneClonedGreen = duckScene.scene.clone(true);
        duckSceneClonedGreen.traverse(child => {
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
        addDuckModel('green', duckSceneClonedGreen);
        console.log('[ADDING MODEL] duck red');
        const duckSceneClonedRed = duckScene.scene.clone(true);
        duckSceneClonedRed.traverse(child => {
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
        addDuckModel('red', duckSceneClonedRed);
        console.log('[ADDING MODEL] duck blue');
        const duckSceneClonedBlue = duckScene.scene.clone(true);
        duckSceneClonedBlue.traverse(child => {
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
        addDuckModel('blue', duckSceneClonedBlue);
        console.log('[ADDING MODEL] duck yellow');
        const duckSceneClonedYellow = duckScene.scene.clone(true);
        duckSceneClonedYellow.traverse(child => {
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
        addDuckModel('yellow', duckSceneClonedYellow);
    }, [duckScene]);
};

export const DUCK_NAMES = [
    'character_duck',
    'character_duckArmLeft',
    'character_duckArmRight',
];

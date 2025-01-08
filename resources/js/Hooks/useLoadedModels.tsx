import {useGLTF} from '@react-three/drei';
import {memo, useEffect, useState} from 'react';
import * as THREE from 'three';
import {useLoadedMaterials} from './useLoadedMaterials';
import {useThree} from '@react-three/fiber';

type Models = {
    board?: THREE.Object3D;
    airModule?: THREE.Object3D;
    duck?: THREE.Object3D;
};

export const useLoadedModels = () => {
    const [models, setModels] = useState<Models>({});
    const boardScene = useGLTF('/models/environment/board.glb');
    const materials = useLoadedMaterials();
    console.log('boardScene:', boardScene);

    const {scene} = useThree();

    useEffect(() => {
        if (!models.board) {
            console.log('[ADDING MODEL] board');
            boardScene.scene.traverse(child => {
                if (child.name === 'spaceship' && child instanceof THREE.Mesh) {
                    console.log('found board');

                    child.rotation.set(3.14, 0, 0);
                    child.position.set(0, -1.5, 0);
                    models.board = child;
                }
            });
        }
        if (!models.airModule) {
            console.log('[ADDING MODEL] air module');
            boardScene.scene.traverse(child => {
                if (child.name === 'air-1' && child instanceof THREE.Mesh) {
                    console.log('found air-1');
                    console.log(child.geometry);
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0x00ff00,
                    });
                    models.airModule = child;
                }
            });
        }
        if (
            materials['metal'] &&
            models.board &&
            models.board instanceof THREE.Mesh &&
            models.board.material !== materials['metal']
        ) {
            console.log('adding material');
            models.board.material = new THREE.MeshStandardMaterial({color: 0x64748b});
            // models.board.material = materials['metal'];
        }
    }, [boardScene, materials]);

    return models;
};

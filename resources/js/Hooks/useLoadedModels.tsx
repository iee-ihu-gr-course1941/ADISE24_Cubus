import {useGLTF} from '@react-three/drei';
import {memo, useEffect, useState} from 'react';
import * as THREE from 'three';
import {useLoadedMaterials} from './useLoadedMaterials';

type Models = {
    board?: THREE.Object3D;
    duck?: THREE.Object3D;
};

export const useLoadedModels = () => {
    const [models, setModels] = useState<Models>({});
    const boardScene = useGLTF('/models/environment/board.glb');
    const materials = useLoadedMaterials();
    console.log('boardScene:', boardScene);

    useEffect(() => {
        if (!models.board) {
            console.log('[ADDING MODEL] board');
            const board = boardScene.scene.children[0];
            if (board instanceof THREE.Mesh) {
                board.rotation.set(3.14, 0, 0);
                board.position.set(0, -1.5, 0);
                models.board = board;
            }
        }
        if (
            materials['metal'] &&
            models.board &&
            models.board instanceof THREE.Mesh &&
            models.board.material !== materials['metal']
        ) {
            console.log('adding material');
            models.board.material = materials['metal'];
        }
    }, [boardScene, materials]);

    return models;
};

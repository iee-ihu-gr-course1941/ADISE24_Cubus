import {create} from 'zustand';
import * as THREE from 'three';
import {PlayerColor} from '@/types/game';

export type LoadedModels = {
    spaceship?: THREE.Object3D;
    duck: {
        [key in PlayerColor]?: THREE.Object3D;
    };
    spaceshipMini?: THREE.Object3D;
};

type State = {
    hasLoaded: boolean;
    models: LoadedModels;
};

type Actions = {
    addModel: (modelName: keyof LoadedModels, model: THREE.Object3D) => void;
    addDuckModel: (modelName: PlayerColor, model: THREE.Object3D) => void;
};

export const useLoadedModels = create<State & Actions>()((set, get) => ({
    models: {duck: {}},
    hasLoaded: false,
    addModel: (modelName, model) => {
        const {models} = get();
        if (!models[modelName]) {
            set(state => ({
                ...state,
                models: {
                    ...state.models,
                    [modelName]: model,
                },
            }));
        }
    },
    addDuckModel: (modelName, model) => {
        set(state => ({
            ...state,
            models: {
                ...state.models,
                duck: {
                    ...state.models.duck,
                    [modelName]: model,
                },
            },
        }));
    },
}));

useLoadedModels.subscribe(state => {
    if (!state.hasLoaded) {
        const hasLoaded =
            !!state.models.spaceship &&
            !!state.models.duck.green &&
            !!state.models.duck.red &&
            !!state.models.duck.blue &&
            !!state.models.duck.yellow;
        console.log(state.models);
        if (hasLoaded) {
            useLoadedModels.setState({hasLoaded: true});
        }
    }
});

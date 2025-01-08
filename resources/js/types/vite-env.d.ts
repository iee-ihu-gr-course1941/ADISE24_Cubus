/// <reference types="vite/client" />

import {ShaderMaterialProps} from '@react-three/fiber';

declare global {
    module '*.glsl' {
        const value: string;
        export default value;
    }
    interface ThreeElements {
        blockShadowMaterial: ShaderMaterialProps;
        lightNoiseMaterial: ShaderMaterialProps;
        airModuleMaterial: ShaderMaterialProps;
        engineMaterial: ShaderMaterialProps;
        pieceMaterial: ShaderMaterialProps;
        // * New extend types go here !
    }
    namespace JSX {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface IntrinsicElements extends ThreeElements {}
    }
}

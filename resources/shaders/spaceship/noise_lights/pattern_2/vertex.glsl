
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vStrength;

uniform float uTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uRandomFactor;

#include ../../../includes/perlinClassic3D.glsl

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec2 noisedUv = uv + perlinClassic3D(vec3(uv * uRandomFactor, uTime*uSpeed*2.0));
    float strength = perlinClassic3D(vec3(noisedUv, - uTime*uSpeed));
    // strength = mod(strength, 0.9);

    modelPosition.y += (1.0 - strength) * uAmplitude;


    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;


    vNormal = modelNormal.xyz;
    vPosition = modelPosition.xyz;
    vUv = noisedUv;

    vStrength = strength;
}

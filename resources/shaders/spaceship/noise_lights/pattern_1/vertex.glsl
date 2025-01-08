
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vStrength;

uniform float uTime;
uniform float uSpeed;

#include ../../../includes/simplexNoise3d.glsl

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float strength = simplexNoise3d(vec3(uv, - uTime*uSpeed));
    strength = mod(strength, 0.9);

    modelPosition.z += (strength) * 0.25;


    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;


    vNormal = modelNormal.xyz;
    vPosition = modelPosition.xyz;
    vUv = uv;

    vStrength = strength;
}

uniform float uSize;
uniform float uTime;

attribute float aRandom;
attribute vec3 aColor;
attribute float aGlowIntensity;

varying vec3 vColor;
varying float vRandom;
varying float vGlowIntensity;

#include ../../includes/random2D.glsl

void main(){
    vec4 modelPositon = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPositon;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = uSize * aRandom;
    gl_PointSize *= ( 1.0 / - viewPosition.z ); // Size Attenuation

    vColor = aColor;
    vRandom = aRandom;
    vGlowIntensity = aGlowIntensity;
}

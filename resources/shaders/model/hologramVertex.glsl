varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;

#include ../includes/random2D.glsl

void main(){
    vec4 modelPositon = modelMatrix * vec4(position, 1.0);

    float glitchTime = uTime - modelPositon.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime*3.45) + sin(glitchTime * 8.76);
    glitchStrength /= 3.0;
    glitchStrength = smoothstep(0.3,1.0,glitchStrength);
    glitchStrength *= 0.25;

    modelPositon.x += (random2D(modelPositon.xz + uTime) - 0.5) * glitchStrength;

    modelPositon.z += (random2D(modelPositon.zx + uTime) - 0.5) * glitchStrength;

    vec4 viewPosition = viewMatrix * modelPositon;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    //* Model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    vPosition = modelPositon.xyz;
    vNormal = modelNormal.xyz;
}

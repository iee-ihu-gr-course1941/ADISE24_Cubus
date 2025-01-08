varying vec2 vUv;
varying float vStrength;

uniform float uTime;
uniform float uSpeed;
uniform float uRandomFactor;
uniform float uDepth;

#include ../../../includes/perlinClassic3D.glsl

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec2 centeredUv = uv - 0.5;

    // Rotation angle based on time
    float angle = uTime * uSpeed * 5.0; // Adjust speed of rotation by changing the multiplier

    // 2D Rotation Matrix
    mat2 rotationMatrix = mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );

    vec2 rotatedUv = rotationMatrix * centeredUv;

    vec2 displacedUv = rotatedUv + 0.5;

    vec2 noisedUv = displacedUv + perlinClassic3D(vec3(displacedUv * uRandomFactor, uTime*uSpeed));

    float strength = perlinClassic3D(vec3(noisedUv * 5.0, uTime*uSpeed*0.25));

    float outerGlow = distance(uv, vec2(0.5)) * 5.0 - 1.4;
    strength += outerGlow;
    strength += step(-0.2, strength) * 0.8;

    strength = clamp(strength, 0.0, 1.0);

    modelPosition.y += strength * uDepth;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vStrength = strength;
}

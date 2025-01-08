varying vec2 vUv;
varying float vStrength;

uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;
uniform float uRandomFactor;
uniform float uSpeed;

#include ../../../includes/perlinClassic3D.glsl

void main(){
    // vec2 centeredUv = vUv - 0.5;
    float distance = distance(vUv, vec2(0.5));

    if(distance > 0.5){
        discard;
    }

    // // Rotation angle based on time
    // float angle = uTime * uSpeed * 5.0; // Adjust speed of rotation by changing the multiplier

    // // 2D Rotation Matrix
    // mat2 rotationMatrix = mat2(
    //     cos(angle), -sin(angle),
    //     sin(angle), cos(angle)
    // );

    // vec2 rotatedUv = rotationMatrix * centeredUv;

    // vec2 displacedUv = rotatedUv + 0.5;

    // vec2 noisedUv = displacedUv + perlinClassic3D(vec3(displacedUv * uRandomFactor, uTime*uSpeed));

    // float strength = perlinClassic3D(vec3(noisedUv * 5.0, uTime*uSpeed*0.25));

    // float outerGlow = distance(vUv, vec2(0.5)) * 5.0 - 1.4;
    // strength += outerGlow;
    // strength += step(-0.2, strength) * 0.8;

    // strength = clamp(strength, 0.0, 1.0);

    vec3 color = mix(uColorEnd, uColorStart, vStrength);
    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
}

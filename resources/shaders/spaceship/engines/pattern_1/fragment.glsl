varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uColorStart;
uniform float uColorIntensity;
uniform float uOpacity;

float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

void main(){

    vec2 centeredUv = vUv - 0.5;
    float flameNoise = noise(vec3(centeredUv * 10.0, uTime * 1.0));

    vec3 color = mix(uColorStart, vec3(0.0), flameNoise);

    gl_FragColor = vec4(color*uColorIntensity, uOpacity);

    #include <colorspace_fragment>
}

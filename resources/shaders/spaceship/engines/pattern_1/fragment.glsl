varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uColorStart;
uniform float uColorIntensity;
uniform float uOpacity;


void main(){

    gl_FragColor = vec4(uColorStart*uColorIntensity, uOpacity);

    #include <colorspace_fragment>
}

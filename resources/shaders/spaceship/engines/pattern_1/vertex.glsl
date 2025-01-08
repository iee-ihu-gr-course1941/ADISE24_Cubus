varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform float uRandomFactor;
uniform float uDepth;


void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vPosition = modelPosition.xyz;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}

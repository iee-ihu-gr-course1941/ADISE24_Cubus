varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;


void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vNormal = modelNormal.xyz;
    vPosition = modelPosition.xyz;
    vUv = uv;
}

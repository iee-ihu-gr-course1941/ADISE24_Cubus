
uniform vec3 uColor;
varying vec2 vUv;
void main(){

    float strength = 1.0;

    gl_FragColor = vec4(uColor, strength);
}

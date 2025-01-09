varying vec2 vUv;
uniform vec3 uColor;
uniform float uGlow;

void main(){
    vec3 outlineColor = uColor * 0.5;

    float strengthX = abs(vUv.x - 0.5);
    float strengthY = abs(vUv.y - 0.5);
    float square1 = step(0.40,max(strengthX, strengthY));
    float square2 = 1.0 - step(0.46,max(strengthX, strengthY));
    float strength = square2 * square1;

    vec3 color = mix(uColor * uGlow, outlineColor, 1.0 - strength);
    gl_FragColor = vec4(color, 1.0);
}

uniform vec3 uColor;
uniform vec3 uLightColor;
uniform vec3 uEndColor;
uniform float uTime;
uniform float uSpeed;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vStrength;


void main(){
    vec4 color = vec4(uColor, 1.0);

    float circleFactor = distance(vUv, vec2(0.5));
    circleFactor = 1.0 - smoothstep(0.0, 0.7, circleFactor);

    color.rgb = mix(color.rgb, uEndColor, smoothstep(0.0, 0.75, vStrength));
    gl_FragColor = color;

    // gl_FragColor = vec4(vec3(circleFactor), 1.0);
    // gl_FragColor = vec4(vStrength,vStrength,vStrength,1.0);

    #include <tonemapping_fragment>
}

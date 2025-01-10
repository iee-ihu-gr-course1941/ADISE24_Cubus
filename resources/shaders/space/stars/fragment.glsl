varying vec3 vColor;
varying float vRandom;
varying float vGlowIntensity;

uniform float uTime;

void main(){
    //* Convert the particle to a circle
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    //* Diffuse point pattern
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength;


    // * Light Point Pattern
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = 1.0 - strength;
    // strength = pow(strength, 10.0);

    vec3 finalColor = mix(vColor*0.25, vColor, strength);
    float glow = sin(uTime * vRandom * 0.05)*vGlowIntensity;


    gl_FragColor = vec4(finalColor + glow, 1.0);
}

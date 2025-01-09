varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;
uniform vec3 uColor;

void main(){

    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing){
        normal *= -1.0;
    }

    float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    //* Fresnel
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    //* dot will return "1" if the vectors are going in the same direction,
    //* "0" if they are perpendicular (kathetos),
    //* -1 if they are opposite
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 3.0);

    //* Fallof
    float falloff = smoothstep(0.8,0.0,fresnel);

    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;

    vec3 mixedColor = mix(uColor, uColor + 1.0, fresnel*0.5);

    gl_FragColor = vec4(mixedColor, holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

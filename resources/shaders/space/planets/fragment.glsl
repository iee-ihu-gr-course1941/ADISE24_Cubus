varying vec2 vUv;

uniform sampler2D uNoiseTexture;
uniform vec3 uColorLow;
uniform vec3 uColorHigh;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform vec3 uLightPosition;

varying vec3 vPosition;
varying vec3 vNormal;

#include ../../includes/directionalLight.glsl
#include ../../includes/ambientLight.glsl

void main(){
    vec3 color = vec3(1.0);

    vec3 noise = texture(uNoiseTexture, vUv).rgb;
    noise = step(0.5, noise);

    color = mix(color, uColorHigh, noise);
    color = mix(color,uColorLow, 1.0 - noise);

    vec3 light = vec3(0.0);


    vec3 viewDirection = normalize(vPosition - cameraPosition);

    light += ambientLight(vec3(1.0), 0.4);

    light += directionalLight(
        uLightColor,  //Light's color
        uLightIntensity,
        normalize(vNormal),
        uLightPosition,
        viewDirection,
        10.0
    );

    color *= light;

    gl_FragColor = vec4(color, 1.0);
}

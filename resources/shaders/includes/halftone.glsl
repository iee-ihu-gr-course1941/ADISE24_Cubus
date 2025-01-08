vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
){
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repetitions;
    uv = mod(uv, 1.0);

    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5*intensity, point);

    return mix(color, pointColor, point);
}
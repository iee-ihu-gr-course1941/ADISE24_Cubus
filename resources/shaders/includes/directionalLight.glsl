vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower){
    vec3 lightDirection = normalize(lightPosition);
    
    //* Shading
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    //* Specular - Reflection
    vec3 lightReflection = reflect(- lightDirection, normal);

    float specular = - dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    return lightColor * lightIntensity * (shading + specular) ;
}
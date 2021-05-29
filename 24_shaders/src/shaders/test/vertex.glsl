uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

//attribute float aRandom;
//varying float vRandom;


/* void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
} */

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z += elevation;
    //modelPosition.z += aRandom * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    vUv = uv;
    vElevation = elevation;
    //vRandom = aRandom;
    gl_Position = projectedPosition;
}
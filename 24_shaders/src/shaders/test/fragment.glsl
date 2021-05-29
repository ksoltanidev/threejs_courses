/* varying float vRandom;

void main()
{
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    //gl_FragColor = vec4(0.5, 0.15 + vRandom * 0.1, 0.1  + vRandom * 0.1, 1.0);
} */

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.6;
    gl_FragColor = textureColor;
}
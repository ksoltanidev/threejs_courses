varying vec3 vColor;

void main()
{
    //flat
    //float strength = 1.0 - step(0.5, distance(gl_PointCoord, vec2(0.5)));

    //siffuse
    //float strength = 1.0 - 2.0 * distance(gl_PointCoord, vec2(0.5));
    
    // Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // Final color
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, 1.0);
}
export default `
precision mediump float;

varying vec2 v_uv;

uniform sampler2D u_diffuseMap;
uniform sampler2D u_bloomMap;
uniform sampler2D u_lumMap;
uniform sampler2D u_aoMap;
uniform vec2 u_lumPCT;
uniform vec2 u_pixelSize;

#include <ACESToneMapping>

void main()
{
    vec3 lum_fact = vec3(0.27, 0.67, 0.06);
    vec3 color = texture2D(u_diffuseMap, v_uv).xyz;

    float ave_lum = texture2D(u_lumMap, vec2(0.5, 0.5)).x;
    
    color = ACESToneMapping(color, ave_lum, u_lumPCT.x);

    vec3 bloom = texture2D(u_bloomMap, v_uv).xyz * 1.3;
    float ao = texture2D(u_aoMap, v_uv).a;
    vec3 final_color = clamp(color * ao + bloom, 0.0, 1.0);

    gl_FragColor = vec4(final_color, 1.0);
}
`;

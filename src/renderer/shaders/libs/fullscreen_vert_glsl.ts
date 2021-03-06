export default `
attribute vec4 a_position;
attribute vec2 a_texcoord;
varying vec2 v_uv;

void main()
{
    v_uv = a_texcoord; // vec2(a_texcoord.x, 1.0 - a_texcoord.y);
    gl_Position = a_position;
}
`;

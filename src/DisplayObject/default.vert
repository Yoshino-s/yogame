attribute vec4 a_Position;
uniform mat4 u_Viewsight;

attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
attribute float a_TextureIndex;
varying float v_TextureIndex;

void main() {
  gl_Position =  u_Viewsight * a_Position;
  v_TexCoord = a_TexCoord;
  v_TextureIndex = a_TextureIndex;
}

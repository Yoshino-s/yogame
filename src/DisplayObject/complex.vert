attribute vec4 a_Position;
uniform mat4 u_Viewsight;

attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
attribute float a_TextureIndex;
varying float v_TextureIndex;

attribute mat4 a_Transform;
attribute mat4 a_Filter;
varying mat4 v_Filter;

void main() {
  gl_Position =  u_Viewsight * a_Transform * a_Position;
  v_TexCoord = a_TexCoord;
  v_TextureIndex = a_TextureIndex;
  v_Filter = a_Filter;
}

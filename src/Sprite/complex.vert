attribute vec4 a_Position;
attribute vec2 a_TexCoord;
attribute float a_TextureIndex;
attribute vec4 a_ColorOffset;
attribute mat4 a_Filter;

uniform mat4 u_Viewsight;

varying vec2 v_TexCoord;
varying float v_TextureIndex;
varying mat4 v_Filter;
varying vec4 v_ColorOffset;


void main() {
  gl_Position =  u_Viewsight * a_Position;
  v_TexCoord = a_TexCoord;
  v_TextureIndex = a_TextureIndex;
  v_Filter = a_Filter;
  v_ColorOffset = a_ColorOffset;
}

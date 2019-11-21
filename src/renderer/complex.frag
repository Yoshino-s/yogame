precision mediump float;

uniform sampler2D u_Sampler[%sampler_count%];

varying vec2 v_TexCoord;
varying float v_TextureIndex;

varying mat4 v_Filter;
varying vec4 v_ColorOffset;


vec4 getSamplerTexture() {
  int t = int(v_TextureIndex);
  for(int i = 0; i< %sampler_count%; i++) {
    if(i==t) {
       return texture2D(u_Sampler[i], v_TexCoord);
    }
  }
  return vec4(0.0);
}

void main() {
  gl_FragColor = v_ColorOffset+ v_Filter * getSamplerTexture();
}

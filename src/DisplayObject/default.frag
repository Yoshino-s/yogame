precision mediump float;

uniform sampler2D u_Sampler[%count%];

varying vec2 v_TexCoord;
varying float v_TextureIndex;

vec4 getSamplerTexture() {
  int t = int(v_TextureIndex);
  for(int i = 0; i< %count%; i++) {
    if(i==t) {
       return texture2D(u_Sampler[i], v_TexCoord);
    }
  }
  return vec4(0.0);
}

void main() {
  gl_FragColor = getSamplerTexture();
}

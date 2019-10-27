import { logger, RendererError, } from "../Renderer";

export const maxTextureUnits = (function(): number{
  const gl = document.createElement("canvas").getContext("webgl");
  if(!gl) return NaN;
  return gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
})();

export const InsideTextureCache = new Map<number, RendererTexture>();

export const ImageCache = new Map<string, HTMLImageElement>();

export const TextureCache = new Map<string, RendererTexture>();

export class RendererTexture {
  gl!: WebGLRenderingContext;
  texture!: WebGLTexture;
  img!: HTMLImageElement;
  width = 0;
  height = 0;
  id!: string;
  constructor(gl: WebGLRenderingContext, id: string) {
    const h = TextureCache.get(id);
    if (h) return h;
    this.id = id;
    if (id !== "empty") {
      if(!ImageCache.has(id)) {
        const info = `Cannot find image(id: ${id}).Maybe you should load it first.`;
        logger.error(info);
        throw new RendererError(info);
      }
      
      this.gl = gl;
      this.img = ImageCache.get(id) as HTMLImageElement;
      this.width = this.img.width;
      this.height = this.img.height;
      const texture = gl.createTexture();
      if(!texture) {
        const info = "Cannot create texture.";
        logger.error(info);
        throw new RendererError(info);
      }
      this.texture = texture;
    }
    
    TextureCache.set(id, this);
  }
  bindTexture(location: number, parameter?: [number, number][], format?: number): void {
    if (this.id !== "empty") {
      const gl = this.gl;
      if(!format) format = gl.RGBA;
      if(!parameter) parameter = [];
      gl.activeTexture(location);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, this.img);
      parameter.forEach(key=>{
        gl.texParameteri(gl.TEXTURE_2D, key[0], key[1]);
      });
      gl.generateMipmap(gl.TEXTURE_2D);
    }
  }
  destroy(): void {
    delete this.texture;
    delete this.img;
  }
}
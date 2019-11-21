import { logger, RendererError, } from "../renderer/Renderer";
import { Rect, } from "../math/coordinate/baseInterface";
import WebGLConstants from "./WebGLConstants";

function serialize(id: string, rect?: Rect): string {
  if (!rect) return id;
  return `${id}-${rect.top}_${rect.left}_${rect.bottom}_${rect.right}`;
}

export const maxTextureUnits = (function(): number{
  const gl = document.createElement("canvas").getContext("webgl");
  if(!gl) return NaN;
  return gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
})();

export const InsideTextureCache = new Map<number, RendererTexture>();

export const ImageCache = new Map<string, HTMLImageElement>();

export const BaseTextureCache = new Map<string, BaseTexture>();

const TextureCache = new Map<string, RendererTexture>();

export class BaseTexture {
  gl!: WebGLRenderingContext;
  texture!: WebGLTexture;
  img!: HTMLImageElement|HTMLCanvasElement;
  width!: number;
  height!: number;
  id!: string;
  constructor(gl: WebGLRenderingContext, id: string, specificImg?: HTMLCanvasElement|HTMLImageElement) {
    const h = BaseTextureCache.get(id);
    if (h) return h;
    this.id = id;
    if (id !== "empty") {
      if (!specificImg) {
        if(!ImageCache.has(id)) {
          const info = `Cannot find image(id: ${id}).Maybe you should load it first.`;
          logger.error(info);
          throw new RendererError(info);
        }
        this.img = ImageCache.get(id) as HTMLImageElement;
      } else {
        this.img = specificImg;
      }
      this.gl = gl;
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
    
    BaseTextureCache.set(id, this);
  }
  bindTexture(location: number, parameter: [number, number][] = [ [ WebGLConstants.TEXTURE_MIN_FILTER, WebGLConstants.LINEAR, ], [ WebGLConstants.TEXTURE_WRAP_S, WebGLConstants.CLAMP_TO_EDGE, ], [ WebGLConstants.TEXTURE_WRAP_T, WebGLConstants.CLAMP_TO_EDGE, ], ], format?: number): void {
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

export default class RendererTexture {
  baseTexture!: BaseTexture;
  width!: number;
  height!: number;
  id!: string;
  rect?: Rect;
  constructor(gl: WebGLRenderingContext, id: string, rect?: Rect, specificId?: string, specificImg?: HTMLImageElement|HTMLCanvasElement, noCache?: boolean) {
    const sid = specificId || serialize(id, rect);
    const h = TextureCache.get(sid);
    if (h) return h;
    this.id = sid;
    this.baseTexture = new BaseTexture(gl, id, specificImg);
    this.rect = rect;
    this.width = this.baseTexture.width;
    this.height = this.baseTexture.height;
    if(!noCache)TextureCache.set(sid, this);
  }
  destroy(): void {
    this.baseTexture.destroy();
    delete this.baseTexture;
  }
}
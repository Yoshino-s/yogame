import { Logger, } from "../utils/index";
import DisplayObject from "../core/DisplayObject";
import RendererProgram from "../webgl/RendererProgram";
import constant from "../constant";

export const logger = new Logger("Renderer");

export class RendererError extends Error{}

export default abstract class Renderer {
  canvas: HTMLCanvasElement;
  
  gl: WebGLRenderingContext;
  program: RendererProgram;
  constructor(canvas: HTMLCanvasElement, vertex: string, fragment: string) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl");

    if(gl === null) {
      logger.error("Cannot get webgl context");
      throw new RendererError("Cannot get webgl context");
    }

    this.gl = gl;

    this.program = new RendererProgram(gl, vertex, fragment.replace(/%sampler_count%/g, `${constant.DefaultValues.MAX_TEXTURE_NUMBER}`));
  }
  abstract startRender(deltaTime: number, time: number): void;
  abstract addRenderData(object: DisplayObject): void;
  abstract flushRender(): void;
  abstract destroy(): void;
}
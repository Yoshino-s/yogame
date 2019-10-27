import { Renderer, RendererError, logger, } from "../Renderer";
import { RendererProgram, } from "./RendererProgram";

export abstract class WebGLRenderer extends Renderer {
  gl: WebGLRenderingContext;
  program: RendererProgram;
  constructor(canvas: HTMLCanvasElement, vertexSource: string, fragmentSource: string) {
    super(canvas);

    const gl = canvas.getContext("webgl");

    if(gl === null) {
      logger.error("Cannot get webgl context");
      throw new RendererError("Cannot get webgl context");
    }

    this.gl = gl;

    this.program = new RendererProgram(gl, vertexSource, fragmentSource);
  }
  destroy(): void {
    delete this.gl;
    this.program.destroy();
  }
}
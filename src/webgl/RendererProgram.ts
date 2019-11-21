import { logger, RendererError, } from "../renderer/Renderer";

export default class RendererProgram {
  vertSource: string;
  fragSource: string;
  gl: WebGLRenderingContext;
  fragShader: WebGLShader;
  vertShader: WebGLShader;
  program: WebGLProgram;
  constructor(gl: WebGLRenderingContext, vertSource: string, fragSource: string) {
    this.gl = gl;
    this.vertSource = vertSource;
    this.fragSource = fragSource;
    this.fragShader = this.loadShader(gl.FRAGMENT_SHADER, fragSource);
    this.vertShader = this.loadShader(gl.VERTEX_SHADER, vertSource);
    this.program = this.initShaderProgram(this.vertShader, this.fragShader);
  }

  loadShader(type: number, source: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if(!shader) {
      const info = "Cannot create shader.";
      logger.error(info);
      throw new RendererError(info);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = `An error occurred compiling the shaders: ${ gl.getShaderInfoLog(shader)}`;
      logger.error(info);
      gl.deleteShader(shader);
      throw new RendererError(info);
    }
    return shader;
  }

  initShaderProgram(vertShader: WebGLShader, fragShader: WebGLShader): WebGLProgram {
    const gl = this.gl;
    const shaderProgram = gl.createProgram();
    if(!shaderProgram) {
      const info = "Cannot create shaderProgram";
      logger.error(info);
      throw new RendererError(info);
    }

    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      const info = `Unable to initialize the shader program: ${ gl.getProgramInfoLog(shaderProgram)}`;
      logger.error(info);
      throw new RendererError(info);
    }
  
    return shaderProgram;
  }

  use(): void {
    this.gl.useProgram(this.program);
  }

  destroy(): void {
    delete this.program;
  }
}
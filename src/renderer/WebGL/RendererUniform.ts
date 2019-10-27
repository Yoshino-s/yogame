import { logger, RendererError, } from "../Renderer";
import { setUniform, } from "./utils";
import { RendererProgram, } from "./RendererProgram";

export class RendererUniform {
  glProgram: RendererProgram;
  name: string;
  location: WebGLUniformLocation;
  type: number;
  constructor(glProgram: RendererProgram, name: string, type: number) {
    const gl = glProgram.gl;
    this.glProgram = glProgram;
    this.name = name;
    this.type = type;
    const location = gl.getUniformLocation(glProgram.program, name);
    if(location === null) {
      const info = `Cannot locate the attribute ${ name }`;
      logger.error(info);
      throw new RendererError(info);
    }
    this.location = location;
    this.type = type;
  }

  setData(data: number[]): void {
    const gl = this.glProgram.gl;
    setUniform(gl, this.type, this.location, data);
  }

  destroy(): void {
    delete this.location;
    delete this.glProgram;
  }
}
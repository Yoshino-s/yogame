import { logger, RendererError, } from "../renderer/Renderer";
import { setAttribute, bindAttribute, } from "./utils";
import RendererProgram from "./RendererProgram";

export default class RendererAttribute {
  glProgram: RendererProgram;
  name: string;
  location: number;
  size: number;
  type: number;
  constructor(glProgram: RendererProgram, name: string, type: number, size: number) {
    const gl = glProgram.gl;
    this.glProgram = glProgram;
    this.name = name;
    this.type = type;
    this.location = gl.getAttribLocation(glProgram.program, name);
    if(this.location < 0) {
      const info = `Cannot locate the attribute ${ name }`;
      logger.error(info);
      throw new RendererError(info);
    }
    this.type = type;
    this.size = size;
  }

  setData(data: number[]): void {
    const gl = this.glProgram.gl;
    setAttribute(gl, this.type, this.location, data);
    gl.disableVertexAttribArray(this.location);
  }

  bindBuffer(stride: number, offset: number, fSize: number): void {
    bindAttribute(this.glProgram.gl, this.type, this.size, this.location, stride, offset, fSize);
  }
  
  destroy(): void {
    //TODO
  }
}

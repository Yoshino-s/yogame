import { logger, RendererError, } from "../renderer/Renderer";

export default class RendererBuffer {
  buffer: WebGLBuffer;
  gl: WebGLRenderingContext;
  target: number;
  usage: number;
  constructor(gl: WebGLRenderingContext, target: number, usage: number) {
    this.gl = gl;
    this.target = target;
    this.usage = usage;
    const buffer = gl.createBuffer();
    if(buffer === null) {
      const info = "Cannot create a buffer.";
      logger.error(info);
      throw new RendererError(info);
    }
    this.buffer = buffer;
  }
  bufferData(data: ArrayBuffer|ArrayBufferView): void {
    this.gl.bindBuffer(this.target, this.buffer);
    this.gl.bufferData(this.target, data, this.usage);
  }
  destory(): void {
    delete this.gl;
    delete this.buffer;
  }
}

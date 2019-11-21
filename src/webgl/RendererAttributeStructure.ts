import RendererProgram from "./RendererProgram";
import RendererAttribute from "./RendererAttribute";
import { RendererError, logger, } from "../renderer/Renderer";
import RendererBuffer from "./RendererBuffer";

export type Attribute = {
  size: number;
  type: number;
};

export type AttributeStructureInfo = {
  [key: string]: Attribute;
}

export type AttributeStructureData<T extends AttributeStructureInfo> = {
  [K in keyof T]: number[];
}

export default class RendererAttributeStructure<T extends AttributeStructureInfo> {
  glProgram: RendererProgram;
  attributes: Map<keyof T, RendererAttribute>;
  stride = 0;
  private data: AttributeStructureData<T>[][] = [];
  constructor(glProgram: RendererProgram, structure: T) {
    this.glProgram = glProgram;
    this.attributes = new Map<keyof T, RendererAttribute>();
    for(const key in structure) {
      const attribute = new RendererAttribute(glProgram, key, structure[key].type, structure[key].size);
      this.attributes.set(key, attribute);
    }
    for(const key in structure) {
      this.stride += structure[key].size;
    }
  }

  get length(): number {
    return this.data.length;
  }

  addData(...data: AttributeStructureData<T>[]): void {
    this.data.push(data);
  }

  clearData(): void {
    this.data = [];
  }

  buildBuffer(): Float32Array {
    const buffer: number[] = [];
    let k = 0;
    this.data.forEach(arr => arr.forEach((v: AttributeStructureData<T>): void=>{
      for(const key in v) {
        if(v[key].length !== (this.attributes.get(key) as RendererAttribute).size) {
          const info = `Wrong size of attribute locate ${key}`;
          logger.error(info);
          throw new RendererError(info);
        }
        v[key].forEach((value: number) => {
          buffer[k++] = value;
        });
      }
    }));
    return new Float32Array(buffer);
  }

  render(buffer: Float32Array, rendererBuffer: RendererBuffer): void {
    let k = 0;
    rendererBuffer.bufferData(buffer);
    const fSize = buffer.BYTES_PER_ELEMENT;
    for(const [ , attribute, ] of this.attributes) {
      attribute.bindBuffer(this.stride, k, fSize);
      k += attribute.size;
    }
  }

  destroy(): void {
    for(const [ , attr, ] of this.attributes) {
      attr.destroy();
    }
    delete this.attributes;
  }
}

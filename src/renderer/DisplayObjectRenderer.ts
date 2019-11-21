/* eslint-disable @typescript-eslint/camelcase */
import VertexSource from "./complex.vert";
import FragmentSource from "./complex.frag";
import RendererAttributeStructure from "../webgl/RendererAttributeStructure";
import WebGLConstants from "../webgl/WebGLConstants";
import { transformFromDefault, CoordinateType, } from "../math/coordinate/coordTransform";
import { BaseTextureCache, } from "../webgl/RendererTexture";
import RendererUniform from "../webgl/RendererUniform";
import constant from "../constant";
import RendererBuffer from "../webgl/RendererBuffer";
import AnimationSprite from "../Sprite/AnimationSprite";
import DisplayObject from "../core/DisplayObject";
import Renderer from "./Renderer";


const SpriteRendererAttributeInfo = {
  a_Position: {
    size: 3,
    type: WebGLConstants.FLOAT_VEC4,
  },
  a_TexCoord: {
    size: 2,
    type: WebGLConstants.FLOAT_VEC2,
  },
  a_TextureIndex: {
    size: 1,
    type: WebGLConstants.FLOAT,
  },
  a_Filter: {
    size: 16,
    type: WebGLConstants.FLOAT_MAT4,
  },
  a_ColorOffset: {
    size: 4,
    type: WebGLConstants.FLOAT_VEC4,
  },
};

export default class DisplayObjectRenderer extends Renderer {
  private arrayBuffer: RendererBuffer;
  private elementBuffer: RendererBuffer;
  private elementArray: number[] = [];
  private elementIndex = 0;
  private index = 0;
  attributeStructure: RendererAttributeStructure<typeof SpriteRendererAttributeInfo>;
  private textures: [string, number][] = [];
  private textureUniform: RendererUniform[] = [];
  private viewportUniform: RendererUniform;
  deltaTime = 0;
  time = 0;
  canvas: any;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas, VertexSource, FragmentSource);
    this.attributeStructure = new RendererAttributeStructure(this.program, SpriteRendererAttributeInfo);
    this.program.use();
    this.viewportUniform = new RendererUniform(this.program, "u_Viewsight", this.gl.FLOAT_MAT4);
    this.viewportUniform.setData([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0.0, 0.0, 0, 1,
    ]);
    for (let i = 0; i < constant.DefaultValues.MAX_TEXTURE_NUMBER; i++) {
      this.textureUniform[i] = new RendererUniform(this.program, `u_Sampler[${i}]`, WebGLConstants.TEXTURE);
    }
    this.arrayBuffer = new RendererBuffer(this.gl, this.gl.ARRAY_BUFFER, this.gl.STATIC_DRAW);
    this.elementBuffer = new RendererBuffer(this.gl, this.gl.ELEMENT_ARRAY_BUFFER, this.gl.STATIC_DRAW);
  }

  startRender(deltaTime: number, time: number): void {
    this.deltaTime = deltaTime;
    this.time = time;
  }

  flushRender(): void {
    if (this.textures.length) this._render();
  }

  private _render(): void {
    this.program.use();
    this.textures.forEach((v, i) => {
      const t = BaseTextureCache.get(v[0]);
      if (!t) return;
      t.bindTexture(WebGLConstants.TEXTURE0 + i);
      this.textureUniform[i].setData([ i, ]);
    });
    const buffer = this.attributeStructure.buildBuffer();
    this.attributeStructure.render(buffer, this.arrayBuffer);
    this.elementBuffer.bufferData(new Uint16Array(this.elementArray));
    this.gl.drawElements(WebGLConstants.TRIANGLE_STRIP, this.elementArray.length, WebGLConstants.UNSIGNED_SHORT, 0);
    
    this.textures = [];
    this.attributeStructure.clearData();
    this.index = 0;
    this.elementArray = [];
  }

  addRenderData(root: DisplayObject): void {
    if (!root.render) return;
    if (this.textures.length === 8) {
      this._render();
    }
    
    if (!root.hide && root.texture.baseTexture.id !== "empty") {
      const width = this.canvas.width;
      const height = this.canvas.height;
      
      const z = root.z;
      const s = 2 / width;
      const s0 = 2 / height;
      const x0 = s * root.left - 1, y0 = 1 - s0 * root.top;
      const x1 = s * root.right - 1, y1 = 1 - s0 * root.bottom;

      let tx0, tx1, ty0, ty1;
      if (root.texture.rect) {
        const tw = root.texture.width;
        const th = root.texture.height;
        const rect = root.texture.rect;
        let res = transformFromDefault({ x: rect.left / tw, y: rect.top / th, }, CoordinateType.Image);
        tx0 = res.x; ty0 = res.y;
        res = transformFromDefault({ x: rect.right / tw, y: rect.bottom / th, }, CoordinateType.Image);
        tx1 = res.x; ty1 = res.y;
      } else {
        tx0 = 0.0;
        ty0 = 1.0;
        tx1 = 1.0;
        ty1 = 0.0;
      }

      if (root instanceof AnimationSprite && root.animation) {
        const interval = root.animationInterval;
        if (interval <= 0) root.nextTexture();
        else {
          if(root.animationLoopLength !== 0) root.switchTexture(Math.round(this.time / interval) % root.animationLoopLength);
        }
      }
      
      let i = this.textures.findIndex((v => v[0] === root.texture.baseTexture.id));
      if (i === -1) {
        this.textures.push([ root.texture.baseTexture.id, 1, ]);
        i = this.textures.length - 1;
      } else {
        this.textures[i][1]++;
      }
      this.attributeStructure.addData({
        a_Position: [ x0, y0, z, ],
        a_TexCoord: [ tx0, ty0, ],
        a_TextureIndex: [ i, ],
        a_Filter: root.filter.filter,
        a_ColorOffset: root.filter.offset,
      }, {
        a_Position: [ x0, y1, z, ],
        a_TexCoord: [ tx0, ty1, ],
        a_TextureIndex: [ i, ],
        a_Filter: root.filter.filter,
        a_ColorOffset: root.filter.offset,
      }, {
        a_Position: [ x1, y0, z, ],
        a_TexCoord: [ tx1, ty0, ],
        a_TextureIndex: [ i, ],
        a_Filter: root.filter.filter,
        a_ColorOffset: root.filter.offset,
      }, {
        a_Position: [ x1, y1, z, ],
        a_TexCoord: [ tx1, ty1, ],
        a_TextureIndex: [ i, ],
        a_Filter: root.filter.filter,
        a_ColorOffset: root.filter.offset,
      });
      const index = this.index;
      const elementIndex = this.elementIndex;
      this.elementArray[elementIndex] = index;
      this.elementArray[elementIndex + 1] = index;
      this.elementArray[elementIndex + 2] = index + 1;
      this.elementArray[elementIndex + 3] = index + 2;
      this.elementArray[elementIndex + 4] = index + 3;
      this.elementArray[elementIndex + 5] = index + 3;
      this.index += 4;
      this.elementIndex += 6;
    }
  }
  destroy(): void {
    delete this.gl;
    this.program.destroy();
  }
}
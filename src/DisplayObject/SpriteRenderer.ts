/* eslint-disable @typescript-eslint/camelcase */
import { WebGLRenderer, } from "../renderer/WebGL/WebGLRenderer";
import VertexSource from "./default.vert";
import FragmentSource from "./default.frag";
import { DisplayObject, } from "./DisplayObject";
import { RendererAttributeStructure, } from "../renderer/WebGL/RendererAttribute";
import { WebGLConstants, } from "../renderer/WebGL/WebGLConstants";
import { transfromFromDefault, CoordinateType, } from "../math/coordinate/coordTransform";
import { TextureCache, } from "../renderer/WebGL/RendererTexture";
import { RendererUniform, } from "../renderer/WebGL/RendererUniform";
import constant from "../constant";
import { RendererBuffer, } from "../renderer/WebGL/RendererBuffer";

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
};

export class SpriteRenderer extends WebGLRenderer {
  private root?: DisplayObject;
  arrayBuffer: RendererBuffer;
  attributeStructure: RendererAttributeStructure<typeof SpriteRendererAttributeInfo>;
  textures: [string, number][] = [];
  textureUniform: RendererUniform[] = [];
  viewportUniform: RendererUniform;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas, VertexSource, FragmentSource.replace(/%count%/g, `${constant.DefaultValues.MAX_TEXTURE_NUMBER}`));
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
  }

  setRoot(root: DisplayObject): void {
    this.root = root;
  }

  render(): void {
    if (!this.root) return;
    this.program.use();
    this.addRenderData(this.root, 0, 0);
    if (this.textures.length) this._render();
    this.clearRenderData();
  }

  _render(): void {
    this.textures.forEach((v, i) => {
      const t = TextureCache.get(v[0]);
      if (!t) return;
      t.bindTexture(WebGLConstants.TEXTURE0 + i);
      this.textureUniform[i].setData([ i, ]);
    });
    const buffer = this.attributeStructure.buildBuffer();
    this.attributeStructure.render(buffer, this.arrayBuffer);
    this.gl.drawArrays(WebGLConstants.TRIANGLE_STRIP, 0, this.attributeStructure.length);
  }

  addRenderData(root: DisplayObject, px = 0, py = 0): void {
    if (!root.render) return;
    if (this.textures.length === 8) {
      this._render();
      this.attributeStructure.clearData();
      this.textures = [];
    }
    const width = this.canvas.width;
    const height = this.canvas.height;
    const rx = root.position.x + px;
    const ry = root.position.y + py;
    const x = -root.width * root.scale * root.center.x + rx;
    const y = -root.height * root.scale * root.center.y + ry;
    const z = root.z;
    const { x: x0, y: y0, } = transfromFromDefault({ x: x / width, y: y / height, }, CoordinateType.WebGL);
    const { x: x1, y: y1, } = transfromFromDefault({ x: (x + root.width) / width, y: (y + root.height) / height, }, CoordinateType.WebGL);

    if (!root.hide) {
      let i = this.textures.findIndex((v => v[0] === root.texture.id));
      if (i === -1) {
        this.textures.push([ root.texture.id, 1, ]);
        i = this.textures.length - 1;
      } else {
        this.textures[i][1]++;
      }
      this.attributeStructure.addData({
        a_Position: [ x0, y0, z, ],
        a_TexCoord: [ 0.0, 1.0, ],
        a_TextureIndex: [ i, ],
      }, {
        a_Position: [ x0, y0, z, ],
        a_TexCoord: [ 0.0, 1.0, ],
        a_TextureIndex: [ i, ],
      }, {
        a_Position: [ x0, y1, z, ],
        a_TexCoord: [ 0.0, 0.0, ],
        a_TextureIndex: [ i, ],

      }, {
        a_Position: [ x1, y0, z, ],
        a_TexCoord: [ 1.0, 1.0, ],
        a_TextureIndex: [ i, ],

      }, {
        a_Position: [ x1, y1, z, ],
        a_TexCoord: [ 1.0, 0.0, ],
        a_TextureIndex: [ i, ],
      }, {
        a_Position: [ x1, y1, z, ],
        a_TexCoord: [ 1.0, 0.0, ],
        a_TextureIndex: [ i, ],
      },);
    }
    root.children.forEach(c => this.addRenderData(c, rx, ry));
  }

  clearRenderData(): void {
    this.textures = [];
    this.attributeStructure.clearData();
  }
}
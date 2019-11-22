import DisplayObject from "../core/DisplayObject";
import RendererManager from "../renderer/RendererManager";
import RendererTexture from "../webgl/RendererTexture";
import { UID, } from "../utils/index";
import Rectangle from "../math/graph/Rectangle";

const _f = (i: number): number => {
  return 2 ** Math.ceil(Math.log2(i));
};

function generateTextTexture(text: string, size = 8, color = "black"): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw Error("During generate charset, cannot create ctx.");
  }
  ctx.font = "16px monospace";
  const lines = text.split("\n");
  const maxLine = lines.reduce((p, s) => p.length > s.length ? p : s, "");
  const mt = ctx.measureText(maxLine);
  const width = canvas.width = _f(mt.width);
  const height = canvas.height = _f(size * 2 * lines.length);
  ctx.font = "16px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.clearRect(0, 0, width, height);
  lines.forEach((s, i) => ctx.fillText(s, 0, size * (i * 2 + 1)));
  return canvas;
}
export default class TextObject extends DisplayObject {
  private _color: string;
  private _text: string;
  constructor(rendererManager: RendererManager, text: string, color = "black") {
    const tex = generateTextTexture(text, 8, color);
    super(rendererManager, tex, new Rectangle(0, tex.height, tex.width, -tex.height ));
    this._text = text;
    this._color = color;
  }
  private reGenerate(): void {
    const tex = generateTextTexture(this._text, 8, this._color);
    this.texture = new RendererTexture(this.gl, UID("__name_texture"), new Rectangle(0, tex.height, tex.width, -tex.height ), undefined, tex, true);
    this.width = this.texture.width;
    this.height = this.texture.height;
  }
  set text(s: string) {
    this._text = s;
    this.reGenerate();
  }
  get text(): string {
    return this._text;
  }
  set color(s: string) {
    this._color = s;
    this.reGenerate();
  }
  get color(): string {
    return this._color;
  }
}

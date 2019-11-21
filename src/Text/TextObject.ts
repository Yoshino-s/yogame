import DisplayObject from "../core/DisplayObject";
import RendererManager from "../renderer/RendererManager";
import RendererTexture from "../webgl/RendererTexture";
import { UID, } from "../utils/index";

const _f = (i: number): number => 2 ** Math.ceil(Math.log2(i));

function generateTextTexture(text: string, size = 8, color = "black"): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw Error("During generate charset, cannot create ctx.");
  }
  const lines = text.split("\n");
  const maxLength = lines.reduce((p, s) => p > s.length ? p : s.length, 0);
  const width = canvas.width = _f(size * maxLength);
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
    super(rendererManager, tex, { left: 0, right: tex.width, bottom: 0, top:tex.height, });
    this._text = text;
    this._color = color;
  }
  private reGenerate(): void {
    const tex = generateTextTexture(this._text, 8, this._color);
    this.texture = new RendererTexture(this.gl, UID("__name_texture"), { left: 0, right: tex.width, bottom: 0, top: tex.height, }, undefined, tex, true);
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

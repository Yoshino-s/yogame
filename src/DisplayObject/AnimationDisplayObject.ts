import DisplayObject, { logger, } from "./DisplayObject";
import { Rect, } from "../math/coordinate/baseInterface";
import { RendererTexture, } from "../renderer/WebGL/RendererTexture";
import Application from "../core/Application";

const fixNum = (l: number, n: number): number => n >= 0 ? n : (l + n);

export default class AnimationDisplayObject extends DisplayObject {
  private _texture0!: RendererTexture;
  textures: RendererTexture[] = [];
  animation = true;
  animationInterval = -1;
  animationLoop = true;
  animationIndex = 0;
  private _animationLoopRange: [number, number] = [ 0, -1, ];
  constructor(app: Application, textures: ({ id: string; rect?: Rect } | RendererTexture | string)[], rects?: Rect[]) {
    super(app, textures[0], rects && rects[0]);
    const gl = app.spriteRenderer.gl;
    if (rects && textures.length !== rects.length) {
      const info = "Not the same length of textures&rects.";
      logger.error(info);
      throw Error(info);
    }
    textures.forEach((v: { id: string; rect?: Rect } | RendererTexture | string, i: number) => {
      if (v instanceof RendererTexture) this.textures[i] = v;
      else if (typeof v === "string") this.textures[i] = new RendererTexture(gl, v, rects && rects[i]);
      else this.textures[i] = new RendererTexture(gl, v.id, v.rect);
    });
  }
  get texture(): RendererTexture {
    if (!this.textures) return this._texture0;
    return this.textures[this.animationIndex];
  }
  set texture(v: RendererTexture) {
    this._texture0 = v;
  }
  get animationLoopRange(): [number, number] {
    return this._animationLoopRange;
  }
  set animationLoopRange(v: [number, number]) {
    if (v[0] > v[1]) {
      const info = `Cannot set the animation loop range as ${v}.`;
      logger.warn(info);
    } else {
      this._animationLoopRange = v;
    }
  }
  get animationLoopLength(): number {
    return fixNum(this.textures.length, this._animationLoopRange[1]) - fixNum(this.textures.length, this._animationLoopRange[0]);
  }
  switchTexture(index: number, relative?: boolean): void {
    if (!this.animation) return;
    if (relative) {
      if (index === 0) return;
      if (index > 0) while (index--) this.nextTexture();
      if (index < 0) while (index++) this.lastTexture();
    } else {
      if (index < this._animationLoopRange[0] && index > this._animationLoopRange[1]) {
        const info = `Cannot set the animation index as ${index}.Index out of range: ${this._animationLoopRange}`;
        logger.warn(info);
      } else {
        this.animationIndex = index;
      }
    }
  }
  nextTexture(): void {
    if (!this.animation) return;
    if (this.animationIndex === fixNum(this.textures.length, this.animationLoopRange[1])) {
      if (!this.animationLoop) return;
      this.animationIndex = this.animationLoopRange[0];
    } else {
      this.animationIndex++;
    }
  }
  lastTexture(): void {
    if (!this.animation) return;
    if (this.animationIndex === fixNum(this.textures.length, this.animationLoopRange[0])) {
      if (!this.animationLoop) return;
      this.animationIndex = this.animationLoopRange[1];
    } else {
      this.animationIndex--;
    }
  }
}
import Renderer, { logger, } from "./Renderer";
import DisplayObject from "../core/DisplayObject";
import DisplayObjectRenderer from "./DisplayObjectRenderer";
import Viewsight from "../viewport/Viewsight";


export default class RendererManager {
  renderers = new Map<string, Renderer>();
  defaultRenderer: Renderer;
  root?: DisplayObject;
  time = performance.now();
  canvas: HTMLCanvasElement;
  viewsight: Viewsight;
  deltaTime = 0;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.viewsight = new Viewsight(this.canvas.width, this.canvas.height);
    this.defaultRenderer = new DisplayObjectRenderer(canvas);
    this.renderers.set("default", this.defaultRenderer);
  }
  registerRenderer<T extends Array<any>>(key: string, renderCons: { new(canvas: HTMLCanvasElement, ...args: T): Renderer }, ...args: T): void {
    this.renderers.set(key, new renderCons(this.canvas, ...args));
  }
  getRenderer(key: string): Renderer {
    return this.renderers.get(key) ?? this.defaultRenderer;
  }
  resize(width: number, height: number): void {
    this.renderers.forEach((renderer: Renderer) => {
      renderer.gl.viewport(0, 0, width, height);
    });
    this.viewsight.resize(width, height);
  }
  render(deltaTime: number): void {
    this.deltaTime = deltaTime;
    this.time = performance.now();
    if (!this.root) {
      const info = "You should set the root object for the renderers.";
      logger.error(info);
      return;
    }
    this.renderers.forEach((renderer: Renderer) => {
      renderer.startRender(deltaTime, this.time, this.viewsight);
    });
    this._render(this.root);
    this.renderers.forEach((renderer: Renderer) => {
      renderer.flushRender();
    });
  }
  private _render(root: DisplayObject): void {
    let renderer = this.renderers.get(root.renderer);
    if (!renderer) renderer = this.defaultRenderer;
    renderer.addRenderData(root);
    root.children.forEach((c: DisplayObject) => this._render(c));
  }
}
/* eslint-disable @typescript-eslint/camelcase */
import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter, } from "events";
import RendererTexture from "../webgl/RendererTexture";
import { Point, Rect, } from "../math/coordinate/baseInterface";
import constant from "../constant";
import { Tuple, UID, } from "../utils/index";
import Logger from "../utils/logger";
import Filter from "../filter/Filter";
import RendererManager from "../renderer/RendererManager";

export const logger = new Logger("DisplayObject");

type DisplayObjectEvents = {
  moveIn: (x: number, y: number) => void;
  moveOut: (x: number, y: number) => void;
  down: (x: number, y: number) => void;
  up: (x: number, y: number) => void;
  upOut: (x: number, y: number) => void;
  move: (x: number, y: number) => void;
  moveOn: (x: number, y: number) => void;
}

type DisplayObjectEmitter = StrictEventEmitter<EventEmitter, DisplayObjectEvents>;

export default class DisplayObject extends (EventEmitter as { new(): DisplayObjectEmitter }) {
  gl: WebGLRenderingContext
  uid = UID("DisplayObject");
  texture: RendererTexture;
  position: Point = { x: 0, y: 0, z: constant.Layer.DEFAULT, };
  center: Point = { x: 0, y: 0, };
  width = 0;
  height = 0;
  scale = 1;
  filter = new Filter();
  hide = false;
  render = true;
  children = new Set<DisplayObject>();
  parent?: DisplayObject;
  absolute = false;
  interaction = false;
  transform: Tuple<number, 4> = [ 
    1, 0,
    0, 1,
  ];
  renderer = "default";
  constructor(rendererManager: RendererManager, texture: { id: string; rect?: Rect} | HTMLCanvasElement | HTMLImageElement | RendererTexture | string, rect?: Rect) {
    super();
    const gl = rendererManager.getRenderer(this.renderer).gl;
    this.gl = gl;
    if (texture instanceof RendererTexture) this.texture = texture;
    else if(texture instanceof HTMLCanvasElement || texture instanceof HTMLImageElement) this.texture = new RendererTexture(gl, UID("__name_texture"), rect, undefined, texture, true);
    else if(typeof texture === "string") this.texture = new RendererTexture(gl, texture, rect);
    else this.texture = new RendererTexture(gl, texture.id, texture.rect);
    this.width = this.texture.width;
    this.height = this.texture.height;
  }
  addChildren(...children: DisplayObject[]): void {
    children.forEach((child) => {
      this.children.add(child);
      child.parent = this;
    });
  }
  removeChildren(...children: DisplayObject[]): void {
    children.forEach((child) => {
      this.children.delete(child);
      child.parent = undefined;
    });
  }
  get x(): number {
    return this.position.x;
  }
  set x(x: number) {
    this.position.x = x;
  }
  get y(): number {
    return this.position.y;
  }
  set y(y: number) {
    this.position.y = y;
  }
  get z(): number {
    return typeof this.position.z === "number" ? this.position.z : constant.Layer.DEFAULT;
  }
  set z(z: number) {
    this.position.z = z;
  }
  get globalX(): number {
    return this.parent && !this.absolute ? this.parent.globalX + this.position.x : this.position.x;
  }
  set globalX(v: number) {
    if (this.parent && !this.absolute) {
      this.position.x = v - this.parent.globalX;
    }
    else {
      this.position.x = v;
    }
  }
  get globalY(): number {
    return this.parent && !this.absolute ? this.parent.globalY + this.position.y : this.position.y;
  }
  set globalY(v: number) {
    if (this.parent && !this.absolute) {
      this.position.y = v - this.parent.globalY;
    }
    else {
      this.position.y = v;
    }
  }
  //rect
  get left(): number {
    return -this.width * this.scale * this.center.x + this.globalX;
  }
  get right(): number {
    return this.left + this.width * this.scale;
  }
  get top(): number {
    return -this.height * this.scale * this.center.y + this.globalY;
  }
  get bottom(): number {
    return this.top + this.height * this.scale;
  }
  get centerPos(): Point {
    return {
      x: this.left + this.width * this.scale / 2,
      y: this.top + this.height * this.scale / 2,
    };
  }
  set opacity(o: number) {
    this.filter.setOpacity(o);
  }
  get opacity(): number {
    return this.filter.filter[15];
  }
  destroy(): void {
    delete this.texture;
  }
}

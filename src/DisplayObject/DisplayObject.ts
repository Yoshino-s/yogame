/* eslint-disable @typescript-eslint/camelcase */
import { isNumber, } from "util";
import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter, } from "events";
import { RendererTexture, } from "../renderer/WebGL/RendererTexture";
import { Point, } from "../math/coordinate/baseInterface";
import constant from "../constant";
import Application from "../core/Application";
import { Tuple, UID, } from "../utils/index";
import Logger from "../utils/logger";

export const logger = new Logger("DisplayObject");

type DisplayObjectEvents = {
  moveIn: () => void;
  moveOut: () => void;
  down: () => void;
  up: () => void;
  upOut: () => void;
  move: () => void;
}

type DisplayObjectEmitter = StrictEventEmitter<EventEmitter, DisplayObjectEvents>;


export class DisplayObject extends (EventEmitter as { new(): DisplayObjectEmitter }) {
  uid = UID("DisplayObject");
  texture: RendererTexture;
  position: Point = { x: 0, y: 0, z: constant.Layer.DEFAULT, };
  center: Point = { x: 0, y: 0, };
  width = 0;
  height = 0;
  scale = 1;
  hide = false;
  render = true;
  children = new Set<DisplayObject>();
  parent?: DisplayObject;
  absolute = false;
  interaction = false;
  moveInObject = false;
  filter: Tuple<number, 16> = [ 1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
  transform: Tuple<number, 4> = [ 
    1, 0,
    0, 1,
  ];
  constructor(app: Application, id: string) {
    super();
    this.texture = new RendererTexture(app.spriteRenderer.gl, id);
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
    return isNumber(this.position.z) ? this.position.z : constant.Layer.DEFAULT;
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
  get top(): number {
    return -this.width * this.scale * this.center.x + this.globalX;
  }
  get bottom(): number {
    return this.top + this.height;
  }
  get left(): number {
    return -this.height * this.scale * this.center.y + this.globalY;
  }
  get right(): number {
    return this.left + this.width;
  }
  destroy(): void {
    delete this.texture;
  }
}

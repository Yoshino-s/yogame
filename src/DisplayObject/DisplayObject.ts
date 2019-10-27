/* eslint-disable @typescript-eslint/camelcase */
import { isNumber, } from "util";
import { RendererTexture, } from "../renderer/WebGL/RendererTexture";
import { Point, } from "../math/coordinate/baseInterface";
import constant from "../constant";
import Application from "../core/Application";

export class DisplayObject {
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
  constructor(app: Application, id: string) {
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
    return this.parent ? this.parent.globalX + this.position.x : this.position.x;
  }
  set globalX(v: number) {
    if (this.parent) {
      this.position.x = v - this.parent.globalX;
    }
    else {
      this.position.x = v;
    }
  }
  get globalY(): number {
    return this.parent ? this.parent.globalY + this.position.y : this.position.y;
  }
  set globalY(v: number) {
    if (this.parent) {
      this.position.y = v - this.parent.globalY;
    }
    else {
      this.position.y = v;
    }
  }
  destroy(): void {
    delete this.texture;
  }
}
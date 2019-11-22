import { MouseInfo, } from "../managers/InteractionResolvers/MouseResolver";
import { Point, Rect, } from "../math/coordinate/baseInterface";
import { SingleTouchInfo, TouchInfo, } from "../managers/InteractionResolvers/TouchResolver";
import DisplayObject from "./DisplayObject";
import InteractionManager from "../managers/InteractionManager";
import { RectGetter, } from "../utils/index";

function contains(rect: Rect, p: Point): boolean {
  return rect.left < p.x && p.x < rect.right && rect.top < p.y && p.y < rect.bottom;
}

export default class SpriteInteraction {
  rectGetter: RectGetter;
  stage: DisplayObject;
  pressInObject = new Map<string, number[]>();
  inObject = new Set<string>();
  isPressed = new Set<number>();
  constructor(rootObject: DisplayObject, rectGetter: RectGetter, im: InteractionManager) {
    this.stage = rootObject;
    this.rectGetter = rectGetter;
    im.mouse.on("move", (info: MouseInfo, pd: () => void) => this.move(info.point, -1, pd));
    im.touch.on("move", (singleInfo: SingleTouchInfo, info: TouchInfo, pd: () => void)=>this.move(singleInfo, singleInfo.id, pd));
    im.mouse.on("up", (info: MouseInfo, pd: () => void) => this.up(info.point, -1, pd));
    im.touch.on("up", (singleInfo: SingleTouchInfo, info: TouchInfo, pd: () => void)=>this.up(singleInfo, singleInfo.id, pd));
    im.mouse.on("down", (info: MouseInfo, pd: () => void) => this.down(info.point, -1, pd));
    im.touch.on("down", (singleInfo: SingleTouchInfo, info: TouchInfo, pd: () => void)=>this.down(singleInfo, singleInfo.id, pd));
  
  }
  move = (p: Point, id: number, pd: () => void): void => {
    const inObject = this.inObject;
    const isPressed = this.isPressed.has(id);
    const rect = this.rectGetter();
    p = { x: p.x - rect.left, y: p.y - rect.top, };
    pd();
    function check(root: DisplayObject): void {
      const v = contains(root, p);
      const uid = root.uid;
      const v1 = inObject.has(uid);
      if (root.interaction) {
        if (v) {
          if (!v1) {
            root.emit("moveIn", p.x, p.y);
          }
          if(isPressed) root.emit("moveOn", p.x, p.y);
          root.emit("move", p.x, p.y);
        } else {
          if (v1) {
            root.emit("moveOut", p.x, p.y);
          }
        }
        v ? inObject.add(uid) : inObject.delete(uid);
      }
      root.children.forEach(check);
    }
    check(this.stage);
  }
  down = (p: Point, id: number, pd: () => void): void => {
    this.isPressed.add(id);
    const rect = this.rectGetter();
    p = { x: p.x - rect.left, y: p.y - rect.top, };
    const pressInObject = this.pressInObject;
    pd();
    if (!contains(rect, p)) return;
    function check(root: DisplayObject): void {
      const v = contains(root, p);
      const uid = root.uid;
      if (root.interaction) {
        if (v) {
          root.emit("down", p.x, p.y);
          const res = pressInObject.get(uid);
          if (res) {
            res.push(id);
          } else {
            pressInObject.set(root.uid, [ id, ]);
          }
        }
      }
      root.children.forEach(check);
    }
    check(this.stage);
  }
  up = (p: Point, id: number, pd: () => void): void => {
    this.isPressed.delete(id);
    const rect = this.rectGetter();
    p = { x: p.x - rect.left, y: p.y - rect.top, };
    const pressInObject = this.pressInObject;
    pd();
    function check(root: DisplayObject): void {
      const v = contains(root, p);
      const res = pressInObject.get(root.uid);
      if (root.interaction && res && res.indexOf(id) !== -1) {
        if (v) {
          root.emit("up", p.x, p.y);
        } else {
          root.emit("upOut", p.x, p.y);
        }
        pressInObject.set(root.uid, res.filter(v => v !== id));
      }
      root.children.forEach(check);
    }
    check(this.stage);
  }
}

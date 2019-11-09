import Application from "../core/Application";
import { MouseInfo, } from "../managers/InteractionResolvers/MouseResolver";
import { Point, } from "../math/coordinate/baseInterface";
import { SingleTouchInfo, TouchInfo, } from "../managers/InteractionResolvers/TouchResolver";
import DisplayObject from "./DisplayObject";

function contains(rect: ClientRect | DOMRect, p: Point, orect: { left: number; top: number } = { top: 0, left: 0, }): boolean {
  return rect.left < p.x - orect.left && p.x - orect.left < rect.right && rect.top < p.y - orect.top && p.y - orect.top < rect.bottom;
}

export class SpriteInteraction {
  rect: ClientRect | DOMRect;
  stage: DisplayObject;
  pressInObject = new Map<string, number[]>();
  inObject = new Set<string>();
  isPressed = new Set<number>();
  constructor(app: Application) {
    this.stage = app.stage;
    this.rect = app.rect;
    app.on("resize", this.resize);
    app.InteractionManager.mouse.on("move", (info: MouseInfo, pd: () => void) => this.move(info.point, -1, pd));
    app.InteractionManager.touch.on("move", (singleInfo: SingleTouchInfo, info: TouchInfo, pd: () => void)=>this.move(singleInfo, singleInfo.id, pd));
    app.InteractionManager.mouse.on("up", (info: MouseInfo, pd: () => void) => this.up(info.point, -1, pd));
    app.InteractionManager.touch.on("up", (singleInfo: SingleTouchInfo, info: TouchInfo, pd: () => void)=>this.up(singleInfo, singleInfo.id, pd));
    app.InteractionManager.mouse.on("down", (info: MouseInfo, pd: () => void) => this.down(info.point, -1, pd));
    app.InteractionManager.touch.on("down", (singleInfo: SingleTouchInfo, info: TouchInfo, pd: () => void)=>this.down(singleInfo, singleInfo.id, pd));
  
  }
  move = (p: Point, id: number, pd: () => void): void => {
    const inObject = this.inObject;
    const isPressed = this.isPressed.has(id);
    const rect = this.rect;
    pd();
    function check(root: DisplayObject): void {
      const v = contains(root, p, rect);
      const uid = root.uid;
      const v1 = inObject.has(uid);
      if (root.interaction) {
        if (v) {
          if (!v1) {
            root.emit("moveIn");
          }
          if(isPressed) root.emit("moveOn");
          root.emit("move");
        } else {
          if (v1) {
            root.emit("moveOut");
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
    const rect = this.rect;
    const pressInObject = this.pressInObject;
    pd();
    if (!contains(this.rect, p)) return;
    function check(root: DisplayObject): void {
      const v = contains(root, p, rect);
      const uid = root.uid;
      if (root.interaction) {
        if (v) {
          root.emit("down");
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
    const rect = this.rect;
    const pressInObject = this.pressInObject;
    pd();
    function check(root: DisplayObject): void {
      const v = contains(root, p, rect);
      const res = pressInObject.get(root.uid);
      if (root.interaction && res && res.indexOf(id) !== -1) {
        if (v) {
          root.emit("up");
        } else {
          root.emit("upOut");
        }
        pressInObject.set(root.uid, res.filter(v => v !== id));
      }
      root.children.forEach(check);
    }
    check(this.stage);
  }
  resize(app: Application): void {
    this.rect = app.rect;
  }
}

import { Tuple, } from "../utils/index";
import { Point, } from "../math/coordinate/baseInterface";

export default class Viewsight {
  private width: number;
  private height: number;
  centerX = 0;
  centerY = 0;
  relative = true;
  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
  }
  resize(width: number, height: number): void {
    this.height = height;
    this.width = width;
  }
  setCenter(p?: Point | [number, number], relative = false): void {
    if (!p) {
      this.centerX = 0;
      this.centerY = 0;
      this.relative = true;
    }else if (Array.isArray(p)) {
      this.centerX = p[0];
      this.centerY = p[1];
      this.relative = relative;
    } else {
      this.centerX = p.x;
      this.centerY = p.y;
      this.relative = relative;
    }
  }
  get data(): Tuple<number, 16> {
    const x = this.relative ? -this.centerX * 2 : (1 - this.centerX * 2 / this.width);
    const y = this.relative ? this.centerY * 2 : (this.centerY * 2 / this.height - 1);
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, 0, 1,
    ];
  }
}
import Graph from "./Graph";

export default class Rectangle implements Graph {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  contains(x: number, y: number): boolean {
    const tx = this.x, ty = this.y;
    return tx < x && x < tx + this.width && ty < y && y < ty + this.height;
  }
  static EMPTY(): Rectangle {
    return new Rectangle(0, 0, 0, 0);
  }
}
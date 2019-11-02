import Graph from "./Graph";

export default class Circle implements Graph {
  x = 0;
  y = 0;
  radius = 0;
  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  contains(x: number, y: number): boolean {
    return Math.hypot(x - this.x, y - this.y) < this.radius;
  }
  static EMPTY(): Circle {
    return new Circle(0, 0, 0);
  }
}
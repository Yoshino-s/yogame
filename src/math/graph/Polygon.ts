import Graph from "./Graph";
import { Point, } from "../coordinate/baseInterface";

export default class Polygon implements Graph {
  points: Point[];
  constructor(...points: Point[]) {
    this.points = points;
  }
  contains(x: number, y: number): boolean {
    let inside = false;

    const length = this.points.length / 2;
    for (let i = 0, j = length - 1; i < length; j = i++) {
      const xi = this.points[i].x;
      const yi = this.points[i].y;
      const xj = this.points[j].x;
      const yj = this.points[j].y;
      const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * ((y - yi) / (yj - yi))) + xi);
      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }
  static EMPTY(): Polygon {
    return new Polygon();
  }
}
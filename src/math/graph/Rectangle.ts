import { Point, } from "../coordinate/baseInterface";

export abstract class Graph {
  abstract contains(point: Point): boolean;
  abstract scaleTo(scale: number): this;
}
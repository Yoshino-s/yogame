import { Point, } from "./baseInterface";

export enum CoordinateType {
  WebGL,
  Image,
  Browser,
  Default,
}

/*
WebGL:
        +1
        |
        |
        |
-1------O------+1
        |
        |
        |
        -1
Image:
+1
|
|
|
O--------+1
Default:
O--------+1
|
|
|
+1
*/

function transformToDefault(point: Point, type: CoordinateType): Point {
  switch(type) {
    case CoordinateType.Default:
    case CoordinateType.Browser:
      return point;
    case CoordinateType.WebGL:
      return {
        x: (point.x + 1.0) / 2.0,
        y: (-point.y + 1.0) / 2.0,
      };
    case CoordinateType.Image:
      return {
        x: point.x,
        y: 1.0 - point.y,
      };
  }
}

function transformFromDefault(point: Point, type: CoordinateType): Point {
  switch(type) {
    case CoordinateType.Default:
    case CoordinateType.Browser:
      return point;
    case CoordinateType.WebGL:
      return {
        x: point.x * 2.0 - 1.0,
        y: 1.0 - point.y * 2.0,
      };
    case CoordinateType.Image:
      return {
        x: point.x,
        y: 1.0 - point.y,
      };
  }
}

function normalize(value: number, rawRange: number[], newRange: number[]): number {
  if(value < rawRange[0] || value > rawRange[1]) return NaN;
  return (value - rawRange[0]) * (newRange[1] - newRange[0]) / (rawRange[1] - rawRange[0]) + newRange[0];
}

export { transformToDefault, transformFromDefault, normalize, };
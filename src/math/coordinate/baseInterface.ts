export interface Point {
  x: number;
  y: number;
  z?: number;
}

export interface Line {
  start: Point;
  end: Point;
}

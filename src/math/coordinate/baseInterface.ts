export interface Point {
  x: number;
  y: number;
  z?: number;
}

export interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width?: number;
  height?: number;
}

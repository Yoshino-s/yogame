function minkowskiDistance(p: number): (x1: number, y1: number, x2: number, y2: number) => number {
  return (x1, y1, x2, y2): number=>Math.pow(Math.pow(Math.abs(x1 - x2), p) + Math.pow(Math.abs(y1 - y2), p), 1 / p);
}
const euclideanDistance = minkowskiDistance(2);

const distance = euclideanDistance;

const manhattanDistance = minkowskiDistance(1);

export default {
  distance,
  euclideanDistance,
  manhattanDistance,
  minkowskiDistance,
};
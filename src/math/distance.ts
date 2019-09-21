function minkowskiDistance(p: number): (x1: number, y1: number, x2: number, y2: number) => number {
  return (x1,y1,x2,y2): number=>Math.pow(Math.pow(Math.abs(x1-x2),p)+Math.pow(Math.abs(y1-y2),p), 1/p);
}

/**
 * Caculate the Euclidean distance between two points.
 * @see https://www.iteblog.com/archives/2317.html#i-2
 * @function
 * @param {number} x1 - x of point 1.
 * @param {number} y1 - y of point 1.
 * @param {number} x2 - x of point 2.
 * @param {number} y2 - y of point 2.
 * @return {number} Euclidean distance between points
 * @memberof Yogame.math
 */
const euclideanDistance = minkowskiDistance(2);
/**
 * Alias of euclideanDistance
 * @function
 * @memberof Yogame.math
 */
const distance = euclideanDistance;

/**
 * Caculate the Manhattan distance between two points.
 * @see https://www.iteblog.com/archives/2317.html#i
 * @function
 * @param {number} x1 - x of point 1.
 * @param {number} y1 - y of point 1.
 * @param {number} x2 - x of point 2.
 * @param {number} y2 - y of point 2.
 * @return {number} Manhattan distance between points
 * @memberof Yogame.math
 */
const manhattanDistance = minkowskiDistance(1);

export default {
  distance,
  euclideanDistance,
  manhattanDistance,
  minkowskiDistance
};
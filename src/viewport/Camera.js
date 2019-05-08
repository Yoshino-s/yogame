import ViewportController from "./ViewportController";
import {distance} from "../math";

/**
 * The camera object to move the viewport.
 * @class
 * @extends Yogame.viewport.ViewportController
 * @memberof Yogame.viewport
 */
class Camera extends ViewportController {
  /**
   * Create the camera controller.
   * @param {Yogame.viewport.Viewport} viewport - The viewport bound to the controller.
   * @param {object} options
   * @param {PIXI.DisplayObject} options.follower - The object which camera will follow.
   * @param {number} [options.fineness=-1] - The fineness of the following.Negative means always follow.Positive means only when object move over some pixel will the camera follow.
   */
  constructor(viewport ,options={}) {
    super();
    this.viewport = viewport;
    this.follower = options.follower;
    this.fineness = options.fineness || -1;
  }
  /**
   * Follow and move.
   */
  updateViewport(){
    if(this.follower) {
      if(distance(this.x, this.y, this.follower.x, this.follower.y)){
        this.eee();
      }
    }
  }
}

export default Camera;
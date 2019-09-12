import * as PIXI from "pixi.js";
import {distance} from "../../math";

/**
 * The virtual gamepad.
 * @class
 * @extends PIXI.Sprite
 * @memberof Yogame.plugins.gamepad
 */
class Gamepad extends PIXI.Sprite {
  /**
   * Create the camera controller.
   * @param {Yogame.plugins.viewport.Viewport} viewport - The viewport bound to the controller.
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
        this.follow();
      }
    }
  }
}

export default Gamepad;

import { Sprite } from 'pixi.js';

/**
 * The controller of viewport interface.
 * @interface
 * @extends PIXI.Sprite
 * @memberof Yogame.viewport
 */
class ViewportController extends Sprite {
  /**
   * Update the viewport bound to the controller.It will be called before viewport being rendered.
   * @function
   * @abstract
   */
  updateViewport() {
    throw Error("Not implemented");
  }
}
export default ViewportController;
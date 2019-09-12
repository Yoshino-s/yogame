import {Container} from "pixi.js";
import {layer} from "../plugins";
/**
 * The application of one game.
 * @extends PIXI.Container
 * @memberof Yogame
 * @static
 */
class Stage extends Container {
  /***/
  constructor() {
    super();
    this.zindex = layer.LAYER.BACKGROUND;
  }
}

export default Stage;
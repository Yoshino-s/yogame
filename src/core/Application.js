import "../plugins";
import * as managers from "../managers";
import Stage from "./Stage";

/**
 * The application of one game.
 * @memberof Yogame
 * @static
 */
class Application{
  /***/
  constructor() {
    /**
     * The task manager.
     * @type {Yogame.managers.TaskManager}
     */
    this.TaskManager = new managers.TaskManager();
    /**
     * The resource manager.
     * @type {Yogame.managers.ResourceManager}
     */
    this.ResourceManager = new managers.ResourceManager();
    /**
     * The interaction manager.
     * @type {Yogame.managers.InteractionManager}
     */
    this.InteractionManager = new managers.InteractionManager();
    /**
     * The stage.
     * @type {Yogame.Stage}
     */
    this.stage = new Stage();
  }
}
export default Application; 
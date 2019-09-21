import Stage from "./Stage";
import TaskManager from "../managers/TaskManager";
import ResourceManager from '../managers/ResourceManager';

class Application{
  TaskManager: TaskManager;
  ResourceManager: ResourceManager;
  stage: Stage
  constructor() {
    this.TaskManager = new TaskManager();
    this.ResourceManager = new ResourceManager();
    this.stage = new Stage();
  }
}

export default Application; 
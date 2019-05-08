import {loaders} from "pixi.js";
import Manager from "./Manager";
import TaskManager from "./TaskManager";

/**
 * The manager of all types of resources, including image, audio, data.
 * @class
 * @extends Yogame.managers.Manager
 * @memberof Yogame.managers
 */
class ResourceManager extends Manager{
  constructor() {
    super();
    /**
     * The loader using PIXI.loaders.shared.
     * @type {PIXI.loaders.Loader}
     */
    this.loader = loaders.shared;
    /**
     * The resources binded to loader.
     * @type {PIXI.loaders.Resource[]}
     */
    this.resources = this.loader.resources;
    /**
     * The data indicating the url of resources.
     * @type {DataOption[]}
     */
    this.data = [];
    this.needLoad = false;
    this.loadTask = new TaskManager.Task(
      this.load, false, {
        timeout: 100
      });
    TaskManager.add(this.loadTask);
  }
  /**
   * The data of resources.
   * @typedef {Object} DataOption
   * @property {string} key - The name of the resource to load, if not passed the url is used.
   * @property {string} url - The url for this resource, relative to the baseUrl of this loader.
   * @property {boolean} autoLoad - Whether it should be loaded automatically.
   */
  /**
   * Load data and load those need to be loaded automatically.
   * @async
   * @param {DataOption[]} dat - Data of resource.
   */
  async loadData (dat) {
    this.data = dat.
      dat.forEach(d=>{
        if(d.autoLoad) this.loader.add(dat[name]);
      });
    await this.loader.load();
  }
  /**
   * Get resource from cache.If not exist,load by PIXI.loaders.shared.
   * @async
   * @param {string} name - name of resource.
   * @return {PIXI.loaders.Resource} The resource.
   */
  async get (name) {
    let i = this.resources[name];
    if(i) return i;
    else{
      i=this.data.find(d=>d.name===name);
      if(i) {
        let dat = i;
        this.loader.add(dat);
        return await (new Promise((resolve)=>{
          this.loader.load((res)=>{
            resolve(res[dat.key]);
          });
        }));
      }else {
        return null;
      }
    } 
  }
  /**
   * Inform loader to load the resources if not exist.
   * @param {string} name - name of resource.
   * @return {number} The status number.0 meams not found.1 means has been got.2 means will be got.
   */
  preGet (name) {
    let i = this.resources[name];
    if(i) return 1;
    else{
      i=this.data.find(d=>d.name===name);
      if(i) {
        let dat = i;
        this.loader.add(dat);
        return 2;
      }else {
        return 0;
      }
    } 
  }

  async load() {
    if(!this.needLoad) return;
    await new Promise((resolve)=>{
      this.loader.load((res)=>{resolve(res);});
    });
    this.needLoad = false;
  }
}

export default ResourceManager;
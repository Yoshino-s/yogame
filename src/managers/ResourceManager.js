import {Loader} from "pixi.js";
import Manager from "./Manager";

/**
 * The manager of all types of resources, including image, audio, data.
 * @extends Yogame.managers.Manager
 * @memberof Yogame.managers
 */
class ResourceManager extends Manager{
  constructor() {
    super();
    /**
     * The loader using PIXI.Loader.shared.
     * @type {PIXI.Loader}
     */
    this.loader = Loader.shared;
    /**
     * The resources binded to loader.
     * @type {PIXI.LoaderResource[]}
     */
    this.resources = this.loader.resources;
    /**
     * The data indicating the url of resources.
     * @type {DataOption}
     */
    this.data = [];
    this.needLoad = false;
  }
  /**
   * Load data and load those need to be loaded automatically.
   * @async
   * @param {Object} dat - Data of resource.
   * @param {string} dat.key - The name of the resource to load, if not passed the url is used.
   * @param {string} dat.url - The url for this resource, relative to the baseUrl of this loader.
   * @param {boolean} dat.autoLoad - Whether it should be loaded automatically.
   */
  async loadData (dat) {
    this.data = dat.
      dat.forEach(d=>{
        if(d.autoLoad) this.loader.add(dat[name]);
      });
    await this.loader.load();
  }
  /**
   * Get resource from cache.If not exist,load by PIXI.Loader.shared.
   * @async
   * @param {string} name - name of resource.
   * @return {PIXI.LoaderResource} The resource.
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
   * Load resource.
   * @async
   * @return {PIXI.LoaderResource} The resource.
   */
  async load() {
    if(!this.needLoad) return;
    await new Promise((resolve)=>{
      this.loader.load((res)=>{resolve(res);});
    });
    this.needLoad = false;
    return this.resources
  }
  
  /**
   * The shared ResourceManager.
   * @static
   * @name shared
   * @type {Yogame.managers.ResourceManager}
   * @memberof Yogame.managers.ResourceManager
   */
  static get shared() {
    if(!ResourceManager._shared) {
      ResourceManager._shared = new ResourceManager();
      ResourceManager._shared.isShared = true;
    }
    return ResourceManager._shared;
  }
}

export default ResourceManager;
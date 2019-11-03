import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter, } from "events";
import TaskManager from "../managers/TaskManager";
import ResourceManager from "../managers/ResourceManager";
import InteractionManager from "../managers/InteractionManager";
import constant from "../constant";
import { RawResolver, } from "../managers/ResourcesResolvers/RawResolver";
import { JSONResolver, } from "../managers/ResourcesResolvers/JSONResolver";
import { ImageResolver, } from "../managers/ResourcesResolvers/ImageResolver";
import AnimationManager from "../managers/AnimationManager";
import { SpriteRenderer, } from "../DisplayObject/SpriteRenderer";
import { DisplayObject, } from "../DisplayObject/DisplayObject";
import { SpriteInteraction, } from "../DisplayObject/SpriteInteraction";

interface ApplicationEvents {
  "resize": (app: Application) => void;
  "error": (error: any) => void;
  "render": (time: number) => void;
}

type ApplicationEmitter = StrictEventEmitter<EventEmitter, ApplicationEvents>;

class Application extends (EventEmitter as {new(): ApplicationEmitter}){
  TaskManager: TaskManager;
  ResourceManager: ResourceManager;
  InteractionManager: InteractionManager;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  spriteRenderer: SpriteRenderer;
  spriteInteraction: SpriteInteraction;
  AnimationManager: AnimationManager;
  stage: DisplayObject;
  constructor(canvas?: HTMLCanvasElement | HTMLElement, width?: number, height?: number) {
    super();
    if(!canvas) {
      canvas = document.createElement("canvas");
      width = constant.DefaultValues.CanvasWidth;
      height = constant.DefaultValues.CanvasHeight;
    }else if(canvas instanceof HTMLCanvasElement) {
      width = width || constant.DefaultValues.CanvasWidth;
      height = height || constant.DefaultValues.CanvasHeight;
    } else {
      const container = canvas;
      canvas = document.createElement("canvas");
      width = container.clientWidth;
      height = container.clientHeight;
    }

    this.canvas = canvas as HTMLCanvasElement;
    this.width = width;
    this.height = height;

    this.AnimationManager = new AnimationManager();
    this.AnimationManager.setRender(t=>this.render(t));

    this.TaskManager = new TaskManager();
    this.InteractionManager = new InteractionManager();

    this.ResourceManager = new ResourceManager();
    this.ResourceManager.use(new RawResolver(), true);
    this.ResourceManager.use(new JSONResolver());
    this.ResourceManager.use(new ImageResolver());
    
    this.spriteRenderer = new SpriteRenderer(this.canvas);
    
    this.stage = this.DisplayObject("empty");
    this.stage.width = this.width;
    this.stage.height = this.height;
    
    this.spriteRenderer.setRoot(this.stage);

    this.spriteInteraction = new SpriteInteraction(this);
  }

  resize(width?: number, height?: number): void {
    width = width || this.canvas.parentElement ? (this.canvas.parentElement as HTMLElement).clientWidth : this.width;
    height = height || this.canvas.parentElement ? (this.canvas.parentElement as HTMLElement).clientHeight : this.height;

    this.width = this.canvas.height = height;
    this.height = this.canvas.width = width;

    this.stage.width = this.width;
    this.stage.height = this.height;

    this.emit("resize", this);
  }

  DisplayObject(id: string): DisplayObject {
    return new DisplayObject(this, id);
  }

  get rect(): ClientRect | DOMRect {
    return this.canvas.getBoundingClientRect();
  }

  private render(time: number): void {
    this.spriteRenderer.render();
    this.emit("render", time);
  }
}

export default Application; 
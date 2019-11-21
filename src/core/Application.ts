import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter, } from "events";
import TaskManager from "../managers/TaskManager";
import ResourceManager from "../managers/ResourceManager";
import InteractionManager from "../managers/InteractionManager";
import constant from "../constant";
import RawResolver from "../managers/ResourcesResolvers/RawResolver";
import JSONResolver from "../managers/ResourcesResolvers/JSONResolver";
import ImageResolver from "../managers/ResourcesResolvers/ImageResolver";
import AnimationManager from "../managers/AnimationManager";
import Sprite from "../Sprite/Sprite";
import DisplayObjectInteraction from "./DisplayObjectInteraction";
import { Rect, } from "../math/coordinate/baseInterface";
import RendererTexture from "../webgl/RendererTexture";
import AnimationSprite from "../Sprite/AnimationSprite";
import TextureResolver from "../managers/ResourcesResolvers/TextureResolver";
import DisplayObject from "./DisplayObject";
import RendererManager from "../renderer/RendererManager";
import TextObject from "../Text/TextObject";

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
  RendererManager: RendererManager;
  displayObjectInteraction: DisplayObjectInteraction;
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

    const rectGetter = (): Rect => this.rect;

    this.canvas = canvas as HTMLCanvasElement;
    this.width = width;
    this.height = height;

    this.AnimationManager = new AnimationManager();
    this.AnimationManager.setRender(t=>this.render(t));

    this.TaskManager = new TaskManager();
    this.InteractionManager = new InteractionManager(document.body);

    this.ResourceManager = new ResourceManager();
    this.ResourceManager.use(new RawResolver(), true);
    this.ResourceManager.use(new JSONResolver());
    this.ResourceManager.use(new ImageResolver());
    
    this.RendererManager = new RendererManager(this.canvas);

    this.ResourceManager.use(new TextureResolver(this.RendererManager.defaultRenderer.gl));
    
    this.stage = this.DisplayObject("empty");
    this.stage.width = this.width;
    this.stage.height = this.height;
    
    this.RendererManager.root = this.stage;

    this.displayObjectInteraction = new DisplayObjectInteraction(this.stage, rectGetter, this.InteractionManager);
  }
  DisplayObject(texture: { id: string; rect?: Rect} | RendererTexture | string, rect?: Rect): DisplayObject {
    return new DisplayObject(this.RendererManager, texture, rect);
  }
  Text(text: string, color?: string): TextObject {
    return new TextObject(this.RendererManager, text, color);
  }
  Sprite(texture: { id: string; rect?: Rect} | RendererTexture | string, rect?: Rect): Sprite {
    return new Sprite(this.RendererManager, texture, rect);
  }
  AnimationSprite(textures: ({ id: string; rect?: Rect } | RendererTexture | string)[], rects?: Rect[]): AnimationSprite {
    return new AnimationSprite(this.RendererManager, textures, rects);
  }
  resize(width: number, height: number): void {
    this.width = this.canvas.width = this.stage.width = width;
    this.height = this.canvas.height = this.stage.height = height;
    this.RendererManager.resize(width, height);
  }
  fullscreen(): void {
    this.resize(document.body.clientWidth, document.body.clientHeight);
  }
  get rect(): ClientRect | DOMRect {
    return this.canvas.getBoundingClientRect();
  }
  private render(time: number): void {
    this.RendererManager.render(time);
    this.emit("render", time);
  }
}

export default Application; 
import { EventEmitter, } from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import { KeyboardResolver, } from "./InteractionResolvers/KeyboardResolver";
import { MouseResolver, } from "./InteractionResolvers/MouseResolver";
import { TouchResolver, } from "./InteractionResolvers/TouchResolver";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InteractionManagerEvents {

}

type InteractionManagerEmitter = StrictEventEmitter<EventEmitter, InteractionManagerEvents>;

export default class InteractionManager extends (EventEmitter as {new(): InteractionManagerEmitter}) {
  keyboard: KeyboardResolver;
  mouse: MouseResolver;
  touch: TouchResolver;
  constructor() {
    super();
    this.keyboard = new KeyboardResolver();
    this.mouse = new MouseResolver();
    this.touch = new TouchResolver();
  }
  private static defaultInstance: InteractionManager;

  static get default(): InteractionManager {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new InteractionManager());
    }
  }
}
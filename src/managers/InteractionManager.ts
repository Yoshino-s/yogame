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
  element: EventTarget;
  constructor(element: EventTarget) {
    super();
    this.element = element;
    this.keyboard = new KeyboardResolver(element);
    this.mouse = new MouseResolver(element);
    this.touch = new TouchResolver(element);
  }
  private static defaultInstance: InteractionManager;

  static get default(): InteractionManager {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new InteractionManager(document.body));
    }
  }
}
import { EventEmitter, } from "events";
import StrictEventEmitter from "strict-event-emitter-types";

interface MouseEvents {
  move: (info: MouseInfo, pd: () => void) => void;
  down: (info: MouseInfo, pd: () => void) => void;
  up: (info: MouseInfo, pd: () => void) => void;
}
export interface MouseInfo {
  buttons: number;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  point: {
    x: number;
    y: number;
  };
  raw: MouseEvent;
}


export enum ButtonType {
  Main = 1,
  Left = 1,
  Secondary = 2,
  Right = 2,
  Auxiliary = 4,
  Middle = 4
}

type MouseEmitter = StrictEventEmitter<EventEmitter, MouseEvents>;

export default class MouseResolver extends (EventEmitter as { new(): MouseEmitter }) {
  status: MouseInfo = {
    buttons: 0,
    alt: false,
    ctrl: false,
    meta: false,
    shift: false,
    point: { x: 0, y: 0, },
    raw: new MouseEvent("mouseup"),
  };
  element: EventTarget;
  constructor (element: EventTarget) {
    // eslint-disable-next-line constructor-super
    super();
    this.element = element;
    this.initiateEvents();
  }
  initiateEvents(): void {
    [ "mousedown", "mousemove", "mouseup", ].forEach(k => {
      this.element.addEventListener(k, e => this.processEvent(e as MouseEvent));
    });
  }
  processEvent(event: MouseEvent): void {
    this.status = {
      buttons: event.buttons,
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey,
      point: { x: event.clientX, y: event.clientY, },
      raw: event,
    };
    const preventDefault = (): void => { event.preventDefault(); };
    switch (event.type) {
      case "mousedown":
        this.emit("down", this.status, preventDefault);
        break;
      case "mouseup":
        this.emit("up", this.status, preventDefault);
        break;
      case "mousemove":
        this.emit("move", this.status, preventDefault);
        break;
      default:
    }
  }
  isPressed(button: ButtonType): boolean {
    return Boolean(this.status.buttons & button);
  }

  private static defaultInstance: MouseResolver;

  static default(): MouseResolver {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new MouseResolver(document.body));
    }
  }
}

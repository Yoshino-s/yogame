import { EventEmitter, } from "events";
import StrictEventEmitter from "strict-event-emitter-types";


interface WheelEvents {
  down: (info: WheelInfo, pd: () => void) => void;
  up: (info: WheelInfo, pd: () => void) => void;
}

export interface WheelInfo {
  deltaX: number;
  deltaY: number;
  deltaZ: number;
  deltaMode: number;
  x: number;
  y: number;
  z: number;
  raw: WheelEvent;
}
type WheelEmitter = StrictEventEmitter<EventEmitter, WheelEvents>;

export class WheelResolver extends (EventEmitter as { new(): WheelEmitter }) {
  status: WheelInfo = {
    deltaMode: 0,
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0,
    x: 0, y: 0, z: 0,
    raw: new WheelEvent("wheel"),
  };
  element: EventTarget;
  constructor (element: EventTarget) {
    // eslint-disable-next-line constructor-super
    super();
    this.element = element;
    this.initiateEvents();
  }
  initiateEvents(): void {
    [ "wheel", ].forEach(k => {
      this.element.addEventListener(k, e => this.processEvent(e as WheelEvent));
    });
  }
  processEvent(event: WheelEvent): void {
    this.status = {
      deltaMode: event.deltaMode,
      deltaX: event.deltaX,
      deltaY: event.deltaY,
      deltaZ: event.deltaZ,
      x: this.status.x + event.deltaX,
      y: this.status.y + event.deltaY,
      z: this.status.z + event.deltaZ,
      raw: event,
    };
    const preventDefault = (): void => { event.preventDefault(); };
    if (event.deltaY > 0) {
      this.emit("up", this.status, preventDefault);
    } else if (event.deltaY < 0) {
      this.emit("down", this.status, preventDefault);
    }
  }
  private static defaultInstance: WheelResolver;

  static get default(): WheelResolver {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new WheelResolver(document.body));
    }
  }
}
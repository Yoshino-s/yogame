import { EventEmitter, } from "events";
import StrictEventEmitter from "strict-event-emitter-types";

interface MouseEvents {
  move: (info: MouseInfo, pd: () => void) => void;
  down: (info: MouseInfo, pd: () => void) => void;
  up: (info: MouseInfo, pd: () => void) => void;
}

interface WheelEvents {
  down: (info: WheelInfo, pd: () => void) => void;
  up: (info: WheelInfo, pd: () => void) => void;
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

export enum ButtonType {
  Main = 1,
  Left = 1,
  Secondary = 2,
  Right = 2,
  Auxiliary = 4,
  Middle = 4
}

type MouseEmitter = StrictEventEmitter<EventEmitter, MouseEvents>;

export class MouseResolver extends (EventEmitter as { new(): MouseEmitter }) {
  status: MouseInfo = {
    buttons: 0,
    alt: false,
    ctrl: false,
    meta: false,
    shift: false,
    point: { x: 0, y: 0, },
    raw: new MouseEvent("mouseup"),
  };
  constructor () {
    // eslint-disable-next-line constructor-super
    super();
    this.initiateEvents();
  }
  initiateEvents(): void {
    [ "mousedown", "mousemove", "mouseup", ].forEach(k => {
      window.addEventListener(k, e => this.processEvent(e as MouseEvent));
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
      return (this.defaultInstance = new MouseResolver());
    }
  }
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
  constructor () {
    // eslint-disable-next-line constructor-super
    super();
    this.initiateEvents();
  }
  initiateEvents(): void {
    [ "wheel", ].forEach(k => {
      window.addEventListener(k, e => this.processEvent(e as WheelEvent));
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
      return (this.defaultInstance = new WheelResolver());
    }
  }
}
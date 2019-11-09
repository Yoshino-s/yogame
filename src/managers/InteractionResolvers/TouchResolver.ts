import { EventEmitter, } from "events";
import StrictEventEmitter from "strict-event-emitter-types";

interface TouchEvents {
  move: (touchInfo: SingleTouchInfo, info: TouchInfo, pd: () => void) => void;
  down: (touchInfo: SingleTouchInfo, info: TouchInfo, pd: () => void) => void;
  up: (touchInfo: SingleTouchInfo, info: TouchInfo, pd: () => void) => void;
}

export interface SingleTouchInfo {
  id: number;
  x: number;
  y: number;
  advanced?: {
    radiusX: number;
    radiusY: number;
    force: number;
    rotationAngle: number;
  };
}

export interface TouchInfo {
  touches: Map<number, SingleTouchInfo>;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  raw: TouchEvent;
}

export interface TouchResolverOptions { forceUpdate: boolean; advanced: boolean }

type TouchEmitter = StrictEventEmitter<EventEmitter, TouchEvents>;

export class TouchResolver extends (EventEmitter as { new(): TouchEmitter }) {
  status: TouchInfo = {
    alt: false,
    ctrl: false,
    meta: false,
    shift: false,
    raw: new TouchEvent("touchcancel"),
    touches: new Map<number, SingleTouchInfo>(),
  };
  options: TouchResolverOptions;
  element: EventTarget;
  constructor (element: EventTarget, options: TouchResolverOptions = { forceUpdate: true, advanced: false, }) {
    // eslint-disable-next-line constructor-super
    super();
    this.element = element;
    this.options = options;
    this.initiateEvents();
  }
  initiateEvents(): void {
    [ "touchstart", "touchmove", "touchend", "touchcancel", ].forEach(k => {
      this.element.addEventListener(k, e => this.processEvent(e as TouchEvent));
    });
  }
  processEvent(event: TouchEvent): void {
    const touchesCache = this.status.touches;
    this.status = {
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey,
      raw: event,
      touches: new Map<number, SingleTouchInfo>(),
    };
    const preventDefault = (): void => { event.preventDefault(); };
    for (let i = 0; i < event.touches.length; i++) {
      const touch: SingleTouchInfo = {
        id: event.touches[i].identifier,
        x: event.touches[i].clientX,
        y: event.touches[i].clientY,
      };
      if (this.options.advanced) {
        touch.advanced = {
          radiusX: event.touches[i].radiusX,
          radiusY: event.touches[i].radiusY,
          force: event.touches[i].force,
          rotationAngle: event.touches[i].rotationAngle,
        };
      }
      if (touchesCache.get(touch.id)) {
        if (this.options.forceUpdate || JSON.stringify(touch) !== JSON.stringify(touchesCache.get(touch.id))) {
          preventDefault();
          this.emit("move", touch, this.status, preventDefault);
          this.status.touches.set(touch.id, touch);
          touchesCache.delete(touch.id);
        }
      } else {
        this.emit("down", touch, this.status, preventDefault);
        this.status.touches.set(touch.id, touch);
      }
      for(const i of touchesCache) {
        this.emit("up", i[1], this.status, preventDefault);
      }
    }
  }

  private static defaultInstance: TouchResolver;

  static get default(): TouchResolver {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new TouchResolver(document.body));
    }
  }
}

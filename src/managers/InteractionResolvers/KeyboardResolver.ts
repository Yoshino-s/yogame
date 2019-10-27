import { EventEmitter, } from "events";
import StrictEventEmitter from "strict-event-emitter-types";

interface Events {
  update: (code: string, info: KeyInfo, pd: () => void) => void;
  delete: (code: string, info: KeyInfo, pd: () => void) => void;
  add: (code: string, info: KeyInfo, pd: () => void) => void;
}

export interface KeyInfo {
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  raw: KeyboardEvent;
}

type KeyboardEmitter = StrictEventEmitter<EventEmitter, Events>;

export class KeyboardResolver extends (EventEmitter as { new(): KeyboardEmitter }) {
  holdKeys: Map<string, KeyInfo> = new Map<string, KeyInfo>();
  constructor() {
    // eslint-disable-next-line constructor-super
    super();
    this.initiateEvents();
  }
  initiateEvents(): void {
    [ "keyup", "keypress", "keydown", ].forEach(k => {
      window.addEventListener(k, e => this.processEvent(e as KeyboardEvent));
    });
  }
  processEvent(event: KeyboardEvent): void {
    if ([ "keydown", "keyup", ].indexOf(event.type) !== -1 && [ "Shift", "Alt", "Control", "Meta", ].indexOf(event.key) !== -1) {
      return;
    }
    const code = event.code;
    const res: KeyInfo = {
      key: event.key,
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey,
      raw: event,
    };
    
    const preventDefault = (): void => { event.preventDefault(); };
    if (event.type === "keyup") {
      this.emit("delete", code, res, preventDefault);
      this.holdKeys.delete(code);
    } else if (this.holdKeys.has(code)) {
      this.emit("update", code, res, preventDefault);
      this.holdKeys.set(code, res);
    } else {
      this.emit("add", code, res, preventDefault);
      this.holdKeys.set(code, res);
    }
  }
  isPressed(code: string): boolean {
    return this.holdKeys.has(code);
  }
  getKey(code: string): KeyInfo | undefined {
    return this.holdKeys.get(code);
  }

  private static defaultInstance: KeyboardResolver;

  static get default(): KeyboardResolver {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new KeyboardResolver());
    }
  }
}
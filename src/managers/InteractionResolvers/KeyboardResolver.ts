import { Resolver } from './Resolver';

export interface KeyInfo {
  key: string,
  code: string,
  repeat: boolean,
  ctrl: boolean,
  shift: boolean,
  alt: boolean,
  meta: boolean
}

const b2i = (b:any)=>b?1:0;

const i2i = (info: KeyInfo)=>`${b2i(info.ctrl)}${b2i(info.alt)}${b2i(info.shift)}${b2i(info.meta)}${info.code}`;

export class KeyboardResolver extends Resolver {
  holdKeys: Map<string, KeyInfo>;
  constructor() {
    super();
    this.holdKeys = new Map<string, KeyInfo>();
    this.initiateEvents();
  }
  initiateEvents(): void {
    window.addEventListener("keydown", (e) => this.processEvent(e));
    window.addEventListener("keyup", (e) => this.processEvent(e));
    window.addEventListener("keypress", (e) => this.processEvent(e));
  }
  processEvent(event: KeyboardEvent) {
    if(["keydown", "keyup"].indexOf(event.type) !== -1 && ["Shift", "Alt", "Control", "Meta"].indexOf(event.key) !== -1){
      return;
    }
    let res: KeyInfo = {
      key: event.key,
      code: event.code,
      repeat: event.repeat,
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey
    };
    let id = i2i(res);
    if(event.type==="keyup") {
      this.emit("delete", res);
      this.holdKeys.delete(id);
    } else if(this.holdKeys.has(id)) {
      this.emit("update", res);
      this.holdKeys.set(id, res);
    } else {
      this.emit("new", res);
    }
  }
}
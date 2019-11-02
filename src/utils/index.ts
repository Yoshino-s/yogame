import Store from "./Store";
import AJSON from "./AJSON";
import Logger from "./logger";
import Dictionary from "./algorithm/Dictionary";

export type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & { length: TLength };

const noop = (): void => { };

function top<T>(timeout: number): Promise<T> {
  return new Promise((_res, rej): void => {
    setTimeout(() => { rej(new Error("Timeout error in promise.")); }, timeout);
  });
}


function PromiseTimeout<T>(executor: ((resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) | Promise<T>, timeout: number): Promise<T> {
  if (!(executor instanceof Promise)) {
    return Promise.race([ new Promise<T>(executor), top<T>(timeout), ]);
  } else {
    return Promise.race([ executor, top<T>(timeout), ]);
  }
}

const dict = new Dictionary<string, number>();

function UID(namespace?: string): string {
  if (namespace === undefined) namespace = "default";
  if (dict.containsKey(namespace)) {
    let id = dict.getValue(namespace) as number;
    dict.setValue(namespace, ++id);
    return `${namespace }_${ id}`;
  } else {
    dict.setValue(namespace, 0);
    return `${namespace }_0`;
  }
}

function isSupportWebGL(): boolean {
  const canvas = document.createElement("canvas");
  return !!canvas.getContext("webgl");
}

let currentWebGLContext: WebGLRenderingContext | null = null;

function getCurrentWebGLContext(): WebGLRenderingContext | null {
  return currentWebGLContext;
}

function setCurrentWebGLContext(gl: WebGLRenderingContext | null): void {
  currentWebGLContext = gl;
}
/**
 * #FF00FF => (1.0, 0.0, 1.0, 1.0)
 */
function splitColor(c: string): [number, number, number, number] {
  return [ parseInt(c.slice(1, 3), 16) / 255, parseInt(c.slice(3, 5), 16) / 255, parseInt(c.slice(5, 7), 16) / 255, 1.0, ];
}

export { splitColor, noop, Logger, AJSON, Store, PromiseTimeout, UID, isSupportWebGL, setCurrentWebGLContext, getCurrentWebGLContext, };
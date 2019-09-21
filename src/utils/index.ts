import Store from "./Store";
import AJSON from "./AJSON";
import Logger from "./logger";
import Dictionary from './algorithm/Dictionary';

const noop = (): void => { };

function top<T>(timeout: number): Promise<T> {
  return new Promise((_res, rej): void => {
    setTimeout(() => { rej(new Error("Timeout error in promise.")); }, timeout);
  });
}


function PromiseTimeout<T>(executor: ((resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) | Promise<T>, timeout: number): Promise<T> {
  if (!(executor instanceof Promise)) {
    return Promise.race([new Promise<T>(executor), top<T>(timeout)]);
  } else {
    return Promise.race([executor, top<T>(timeout)]);
  }
}

let dict = new Dictionary<string, number>();

function UID(namespace?: string): string {
  if (namespace === undefined) namespace = "defalut";
  if (dict.containsKey(namespace)) {
    let id = dict.getValue(namespace) as number;
    dict.setValue(namespace, ++id);
    return namespace + '_' + id;
  } else {
    dict.setValue(namespace, 0);
    return namespace + "_0";
  }
}

export { noop, Logger, AJSON, Store, PromiseTimeout, UID };
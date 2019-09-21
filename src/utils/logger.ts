/* eslint-disable no-console */
type LogFunction = (...args: any[]) => void;

interface ConsoleLike {
  trace: LogFunction;
  info: LogFunction;
  log: LogFunction;
  debug: LogFunction;
  warn: LogFunction;
  error: LogFunction;
}

enum ConsoleKey {
  trace = "trace",
  info = "info",
  log = "log",
  debug = "debug",
  warn = "warn",
  error = "error"
}

const LEVEL: {[key: string]: number} = {
  TRACE: 1,
  INFO: 2,
  DEBUG: 3,
  LOG: 3,
  WARN: 4,
  ERROR: 5
};

function log(...args: any[]): void {
  if(log.level>LEVEL.DEBUG) return;
  console.log(...args);
}

log.level = LEVEL.DEBUG;
log.LEVEL = LEVEL;

log.log = log;
log.trace = (...args: any[]): void => {
  if(log.level>LEVEL.TRACE) return;
  console.trace(...args);
};
log.info = (...args: any[]): void => {
  if(log.level>LEVEL.INFO) return;
  console.info(...args);
};
log.debug = (...args: any[]): void => {
  if(log.level>LEVEL.DEBUG) return;
  console.debug(...args);
};
log.warn = (...args: any[]): void => {
  if(log.level>LEVEL.WARN) return;
  console.warn(...args);
};
log.error = (...args: any[]): void => {
  if(log.level>LEVEL.ERROR) return;
  console.error(...args);
};

class Logger {
  field: string;
  private _console: ConsoleLike;
  trace!: LogFunction;
  info!: LogFunction;
  log!: LogFunction;
  debug!: LogFunction;
  warn!: LogFunction;
  error!: LogFunction;
  constructor(field?: string, redirect: ConsoleLike = console) {
    if(!field) {
      this.field = "DEFAULT";
    } else {
      this.field = field;
    }
    this._console = redirect;
    (["trace", "info", "log", "debug", "warn", "error"] as ConsoleKey[]).forEach((key): void => {
      this[key] = (...args: any[]): void => this._console[key](`[${this.field}] [${key.toUpperCase()}]`, ...args);
    });
  }
  static log = log;
}

export default Logger;
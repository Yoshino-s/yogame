import eruda from "eruda";
import * as log from "loglevel";
/**
 * This namespace contains debug tools.
 * @namespace Yogame.utils.debug
 */

/**
 * The console on mobile.
 * @member {module:eruda} eruda
 * @see https://github.com/liriliri/eruda
 * @memberof Yogame.utils.debug
 */
eruda.init({tool: ['console']});

/**
 * The console on mobile.
 * @member {module:loglevel} log
 * @see https://github.com/pimterry/loglevel
 * @memberof Yogame.utils.debug
 */
log.setLevel(process.env.NODE_ENV === "development"?0:3);

window.log = log;

const messages = [];

const addMessage = (m) => {messages.push(m);setTimeout(()=>messages.shift(), 1000);document.getElementById("log").innerHTML=messages.join('</br>')}

export default {
  eruda,
  log,
  addMessage
};
import * as Yogame from "./src"

window.Yogame = Yogame

window.tm = new Yogame.managers.TaskManager();


let i=0;
window.tm.add(async function(){
  await (new Promise((res)=>setTimeout(res,1000)))
  Yogame.utils.debug.addMessage(i++);
})
import Manager from "../Manager";

/**
 * The manager of all interaction, including Touch.
 
 * @class
 * @extends Yogame.managers.Manager
 * @memberof Yogame.managers
 * @static
 */
class InteractionManager extends Manager {
  /***/
  constructor() {
    super();
    
    this.lastestEvent = new TouchEvent("touchcancel");
    this.touchCount = 0;
    
    (["touchstart", "touchend", "touchmove", "touchcancel"]).forEach(eventName=>{
      document.addEventListener(eventName, this.eventProcess.bind(this));
    });
  }
  eventProcess(event) {
    this.lastestEvent = event;
    let text = "";
    for (let i=0;i< event.touches.length;i++) {
      let touch=event.touches[i];
      text+=Math.round(touch.clientX)+","+Math.round(touch.clientY)+"</br>";
    }
    document.getElementById("log1").innerHTML= text;
  }
}

export default InteractionManager;
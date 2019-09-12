import * as PIXI from "pixi.js";
import * as Yogame from "./src";
import body_wall from "./assets/body_wall.png";
import body_floor from "./assets/body_floor.png";
import body_cell from "./assets/body_cell.png";
import body_hole from "./assets/body_wall.png";

window.PIXI=PIXI;Yogame;
let app = window.app = new PIXI.Application(window.innerWidth, window.innerHeight, { resolution: 1, clearBeforeRender: false, autoResize: true, backgroundColor: 0x333333 });

document.body.appendChild(app.renderer.view);
document.body.style.margin = 0;

PIXI.Loader.shared
  .add();
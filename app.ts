import * as PIXI from 'pixi.js';
import Yogame from "./src/index";

window.PIXI = PIXI;

(window as any).Yogame = Yogame;

let app = (window as any).app = new Yogame.Application();

app.InteractionManager.keyboard.on("change", console.log);

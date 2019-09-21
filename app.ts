import * as PIXI from "pixi.js";
import Yogame from "./src/index";

window.PIXI = PIXI;

(window as any).Yogame = Yogame;

(window as any).app = new Yogame.Application();

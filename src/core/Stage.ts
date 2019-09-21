import { Container } from 'pixi.js';
import constant from "../constant";

export default class Stage extends Container {
  constructor() {
    super();
    this.zIndex = constant.Layer.BACKGROUND;
  }
}

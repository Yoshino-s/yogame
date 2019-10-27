import { Logger, } from "../utils/index";

export const logger = new Logger("Renderer");

export class RendererError extends Error{}

export abstract class Renderer {
  canvas: HTMLCanvasElement;
  rect: ClientRect | DOMRect;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.rect = canvas.getBoundingClientRect();
  }
  abstract render(): void;
  abstract destroy(): void;
}
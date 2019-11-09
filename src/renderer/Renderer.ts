import { Logger, } from "../utils/index";

export const logger = new Logger("Renderer");

export class RendererError extends Error{}

export abstract class Renderer {
  canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }
  abstract render(deltaTime: number): void;
  abstract destroy(): void;
}
export type RenderFunction = (time: number) => void;

const emptyRender = function (time: number): void {
  time + 0;
};

export default class AnimationManager {
  fps = 0;
  deltaTime = 0;
  rafId = 0;
  lastFrameTime = 0;
  render: RenderFunction = emptyRender;
  constructor() {
    this.rafId = requestAnimationFrame(t => this.loop(t));
  }

  setRender(render: RenderFunction): void {
    this.render = render;
  }

  loop(time: number): void {
    this.deltaTime = time - this.lastFrameTime;
    this.fps = 1000 / this.deltaTime;
    this.lastFrameTime = time;
    this.render(this.deltaTime);
    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }
  
  private static defaultInstance: AnimationManager;

  static get default(): AnimationManager {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new AnimationManager());
    }
  }
}

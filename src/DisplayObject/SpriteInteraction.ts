import InteractionManager from "../managers/InteractionManager";
import { SpriteRenderer, } from "./SpriteRenderer";

export class SpriteInteraction {
  interaction: InteractionManager;
  renderer: SpriteRenderer;
  constructor(renderer: SpriteRenderer, interaction: InteractionManager) {
    this.interaction = interaction;
    this.renderer = renderer;
  }
}
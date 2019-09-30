import Manager from './Manager';
import { KeyboardResolver } from './InteractionResolvers/KeyboardResolver';

export default class InteractionManager extends Manager {
  keyboard: KeyboardResolver;
  constructor() {
    super();
    this.keyboard = new KeyboardResolver();
  }
}
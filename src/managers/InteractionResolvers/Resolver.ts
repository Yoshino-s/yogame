import { EventEmitter } from 'events';
export abstract class Resolver extends EventEmitter{
  abstract initiateEvents(): void;
  abstract processEvent(event: KeyboardEvent): void;
}
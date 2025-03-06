import { grid } from "../App";

export enum GameEventType {
  QuartetRotation,
  JewelRemovals,
  ColumnRefill,
}

export const GAME_EVENT_TYPE_STRINGS: Record<GameEventType, string> = {
  [GameEventType.QuartetRotation]: "QuartetRotation",
  [GameEventType.JewelRemovals]: "JewelRemovals",
  [GameEventType.ColumnRefill]: "ColumnRefill",
};

export abstract class GameEvent {
  protected isComplete: boolean = false;
  constructor(public type: GameEventType) {}
  getIsComplete() {
    return this.isComplete;
  }
  abstract start(): void;
  abstract onComplete(): void;
}

export class GameEventManager {
  private events: GameEvent[] = [];
  private current: GameEvent | undefined = undefined;
  constructor() {}

  process() {
    const currentEventCompleted = this.getCurrent()?.getIsComplete();
    if (currentEventCompleted) {
      this.getCurrent()?.onComplete();
    }

    if (this.getCurrent()?.getIsComplete() || !this.isProcessing())
      this.startProcessingNext();
  }

  addEvent(event: GameEvent) {
    this.events.push(event);
  }

  isProcessing() {
    return this.current !== undefined;
  }

  isEmpty() {
    return this.events.length === 0;
  }

  setCurrentStepForDebug(eventType: GameEventType | null) {
    if (!grid.currentlyProcessingGameEventTypeSetter) return;
    grid.currentlyProcessingGameEventTypeSetter(eventType);
  }

  startProcessingNext() {
    this.current = this.events.shift();
    const current = this.current;
    if (!current) return this.setCurrentStepForDebug(null);
    current.start();
    this.setCurrentStepForDebug(current.type);
  }

  getCurrent() {
    return this.current;
  }
  // rotate
  // find matches
  // all at once:
  // - coalesce 4s
  // - fadeout 3s
  // - explode
  // refill
  // fall
}

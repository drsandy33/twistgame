import { Jewel } from ".";
import { Milliseconds } from "../types";

export abstract class JewelAnimation {
  timeStarted: Milliseconds = Date.now();
  protected abstract duration: Milliseconds;

  constructor(
    protected jewel: Jewel,
    public onComplete: () => void
  ) {}
  abstract update(): void;
  isComplete() {
    const elapsed = Date.now() - this.timeStarted;
    return elapsed >= this.duration;
  }
}

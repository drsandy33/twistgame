import { Jewel } from ".";
import { FALLING_ANIMATION_DURATION } from "../app-consts";
import { Point } from "../jewel-quartet";
import { lerp } from "../utils";
import { Milliseconds } from "./rotation-animation";

export class TranslationAnimation {
  timeStarted: Milliseconds = Date.now();
  duration: Milliseconds = FALLING_ANIMATION_DURATION;

  constructor(
    private originalPosition: Point,
    private destinationPosition: Point,
    private jewel: Jewel,
    private onComplete: () => void
  ) {}
  update() {
    const elapsed = Date.now() - this.timeStarted;
    const percentElapsed = elapsed / this.duration;
    const cappedPercentElapsed = Math.min(1, percentElapsed);

    const newPosition = new Point(
      lerp(
        this.originalPosition.x,
        this.destinationPosition.x,
        cappedPercentElapsed
      ),
      lerp(
        this.originalPosition.y,
        this.destinationPosition.y,
        cappedPercentElapsed
      )
    );

    this.jewel.pixelPosition.x = newPosition.x;
    this.jewel.pixelPosition.y = newPosition.y;

    if (percentElapsed >= 1) {
      this.onComplete();
      return true;
    }
  }
}

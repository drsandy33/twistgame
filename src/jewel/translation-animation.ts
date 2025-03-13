import { Jewel } from ".";
import { FALLING_ANIMATION_DURATION } from "../app-consts";
import { Point } from "../types";
import { Milliseconds } from "../types";
import { lerp } from "../utils";
import { JewelAnimation } from "./animation";

export class TranslationAnimation extends JewelAnimation {
  duration: Milliseconds = FALLING_ANIMATION_DURATION;

  constructor(
    private originalPosition: Point,
    private destinationPosition: Point,
    jewel: Jewel,
    onComplete: () => void
  ) {
    super(jewel, onComplete);
  }
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
  }
}

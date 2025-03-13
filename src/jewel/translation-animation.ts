import { Jewel } from ".";
import { TIME_TO_TRANSLATE_ONE_PIXEL } from "../app-consts";
import { Point } from "../types";
import { Milliseconds } from "../types";
import { easeIn, lerp } from "../utils";
import { JewelAnimation } from "./animation";

export class TranslationAnimation extends JewelAnimation {
  duration: Milliseconds;

  constructor(
    private originalPosition: Point,
    private destinationPosition: Point,
    jewel: Jewel,
    onComplete: () => void
  ) {
    super(jewel, onComplete);
    const distance = originalPosition.distance(destinationPosition);
    this.duration = TIME_TO_TRANSLATE_ONE_PIXEL * distance;
  }
  update() {
    const elapsed = Date.now() - this.timeStarted;
    const percentElapsed = elapsed / this.duration;
    const cappedPercentElapsed = Math.min(1, percentElapsed);

    const newPosition = new Point(
      lerp(
        this.originalPosition.x,
        this.destinationPosition.x,
        easeIn(cappedPercentElapsed)
      ),
      lerp(
        this.originalPosition.y,
        this.destinationPosition.y,
        easeIn(cappedPercentElapsed)
      )
    );

    this.jewel.pixelPosition.x = newPosition.x;
    this.jewel.pixelPosition.y = newPosition.y;
  }
}

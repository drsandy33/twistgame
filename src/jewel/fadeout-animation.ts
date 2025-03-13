import { Jewel } from ".";
import { FADEOUT_ANIMATION_DURATION } from "../app-consts";
import { Milliseconds } from "../types";
import { lerp } from "../utils";
import { JewelAnimation } from "./animation";

export class FadeoutAnimation extends JewelAnimation {
  duration: Milliseconds = FADEOUT_ANIMATION_DURATION;

  constructor(jewel: Jewel, onComplete: () => void) {
    super(jewel, onComplete);
  }
  update() {
    const elapsed = Date.now() - this.timeStarted;
    const percentElapsed = elapsed / this.duration;
    const cappedPercentElapsed = Math.min(1, percentElapsed);
    const newOpacity = lerp(1, 0, cappedPercentElapsed);
    this.jewel.opacity = newOpacity;
  }
}

import { Jewel } from ".";
import { Milliseconds } from "./rotation-animation";
import { FADEOUT_ANIMATION_DURATION } from "../app-consts";
import { lerp } from "../utils";

export class FadeoutAnimation {
  timeStarted: Milliseconds = Date.now();
  duration: Milliseconds = FADEOUT_ANIMATION_DURATION;

  constructor(private jewel: Jewel, private onComplete: () => void) {}
  update() {
    const elapsed = Date.now() - this.timeStarted;
    const percentElapsed = elapsed / this.duration;
    const cappedPercentElapsed = Math.min(1, percentElapsed);
    const newOpacity = lerp(1, 0, cappedPercentElapsed);
    this.jewel.opacity = newOpacity;

    if (percentElapsed >= 1) {
      this.onComplete();
      return true;
    }
  }
}

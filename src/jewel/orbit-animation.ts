import { Jewel } from ".";
import { JEWEL_DIAMETER, ROTATION_ANIMATION_DURATION } from "../app-consts";
import { Point } from "../types";
import { Milliseconds, Radians } from "../types";
import { easeInOut, getOrbitPosition, lerpAngle, pythagorean } from "../utils";
import { JewelAnimation } from "./animation";

export class OrbitAnimation extends JewelAnimation {
  duration: Milliseconds = ROTATION_ANIMATION_DURATION;
  radius: number = pythagorean(JEWEL_DIAMETER, JEWEL_DIAMETER) / 2;
  constructor(
    private center: Point,
    private originalAngle: Radians,
    private destinationAngle: Radians,
    jewel: Jewel,
    onComplete: () => void
  ) {
    super(jewel, onComplete);
  }
  update() {
    const elapsed = Date.now() - this.timeStarted;
    const percentElapsed = elapsed / this.duration;
    const cappedPercentElapsed = Math.min(1, percentElapsed);

    const newAngle = lerpAngle(
      this.originalAngle,
      this.destinationAngle,
      easeInOut(cappedPercentElapsed)
    );
    const newPosition = getOrbitPosition(this.center, this.radius, newAngle);
    this.jewel.pixelPosition.x = newPosition.x;
    this.jewel.pixelPosition.y = newPosition.y;
  }
}

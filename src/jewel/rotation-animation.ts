import { Jewel } from ".";
import { JEWEL_DIAMETER } from "../app-consts";
import { Point } from "../jewel-quartet";
import { easeInOut, getOrbitPosition, lerpAngle, pythagorean } from "../utils";

export type Milliseconds = number;
export type Radians = number;

export class RotationAnimation {
  timeStarted: Milliseconds = Date.now();
  duration: Milliseconds = 500;
  radius: number = pythagorean(JEWEL_DIAMETER, JEWEL_DIAMETER) / 2;
  constructor(
    private center: Point,
    private originalAngle: Radians,
    private destinationAngle: Radians,
    private jewel: Jewel,
    private onComplete: () => void
  ) {}
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

    if (percentElapsed >= 1) {
      this.onComplete();
      return true;
    }
  }
}

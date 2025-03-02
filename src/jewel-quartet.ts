import { ROTATION_ANIMATION_DURATION } from "./app-consts";
import { Grid } from "./grid";
import { Jewel } from "./jewel";
import { RotationAnimation } from "./jewel/rotation-animation";
import { MatchChecker } from "./match-checker";
import {
  calculateAngle,
  calculateCenter,
  findHypoteneuseCenterPoint,
} from "./utils";

export class Point {
  constructor(public x: number, public y: number) {}
}
export class JewelQuartet {
  public topLeftPosition: Point;
  public topRightPosition: Point;
  public bottomLeftPosition: Point;
  public bottomRightPosition: Point;
  constructor(public position: Point) {
    this.topLeftPosition = new Point(this.position.x, this.position.y);
    this.topRightPosition = new Point(this.position.x + 1, this.position.y);
    this.bottomRightPosition = new Point(
      this.position.x + 1,
      this.position.y + 1
    );
    this.bottomLeftPosition = new Point(this.position.x, this.position.y + 1);
  }
  selectJewels(grid: Grid) {
    grid.selectJewelAtPosition(this.topLeftPosition);
    grid.selectJewelAtPosition(this.topRightPosition);
    grid.selectJewelAtPosition(this.bottomLeftPosition);
    grid.selectJewelAtPosition(this.bottomRightPosition);
  }
  getJewels(grid: Grid) {
    const topLeftJewel = grid.getJewelAtPosition(this.topLeftPosition);
    const topRightJewel = grid.getJewelAtPosition(this.topRightPosition);
    const bottomLeftJewel = grid.getJewelAtPosition(this.bottomLeftPosition);
    const bottomRightJewel = grid.getJewelAtPosition(this.bottomRightPosition);
    return [topLeftJewel, topRightJewel, bottomLeftJewel, bottomRightJewel];
  }
  rotate(grid: Grid) {
    const topLeftJewel = grid.getJewelAtPosition(this.topLeftPosition);
    const topRightJewel = grid.getJewelAtPosition(this.topRightPosition);
    const bottomLeftJewel = grid.getJewelAtPosition(this.bottomLeftPosition);
    const bottomRightJewel = grid.getJewelAtPosition(this.bottomRightPosition);
    const rotationCenter = calculateCenter([
      topLeftJewel.pixelPosition,
      topRightJewel.pixelPosition,
      bottomRightJewel.pixelPosition,
      bottomLeftJewel.pixelPosition,
    ]);

    startRotationAnimation(
      topLeftJewel,
      rotationCenter,
      topRightJewel.pixelPosition
    );
    startRotationAnimation(
      topRightJewel,
      rotationCenter,
      bottomRightJewel.pixelPosition
    );
    startRotationAnimation(
      bottomRightJewel,
      rotationCenter,
      bottomLeftJewel.pixelPosition
    );
    startRotationAnimation(
      bottomLeftJewel,
      rotationCenter,
      topLeftJewel.pixelPosition
    );
    setTimeout(() => {
      const matchChecker = new MatchChecker(grid);
      matchChecker.checkForMatches();
    }, ROTATION_ANIMATION_DURATION);
    grid.putJewelInPosition(this.topRightPosition, topLeftJewel);
    grid.putJewelInPosition(this.bottomRightPosition, topRightJewel);
    grid.putJewelInPosition(this.bottomLeftPosition, bottomRightJewel);
    grid.putJewelInPosition(this.topLeftPosition, bottomLeftJewel);
  }
  isRotating(grid: Grid) {
    for (const jewel of this.getJewels(grid)) {
      if (jewel.rotationAnimation) return true;
    }
    return false;
  }
}
function startRotationAnimation(
  jewelToRotate: Jewel,
  rotationCenter: Point,
  destinationPosition: Point
) {
  const originalAngle = calculateAngle(
    rotationCenter,
    jewelToRotate.pixelPosition
  );
  console.log(originalAngle);
  const destinationAngle = calculateAngle(rotationCenter, destinationPosition);
  jewelToRotate.rotationAnimation = new RotationAnimation(
    rotationCenter,
    originalAngle,
    destinationAngle,
    jewelToRotate,
    () => {}
  );
}

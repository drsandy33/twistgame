import { Point } from "./types";

export class AnimationRegistry {
  activeAnimationCellPositions: Point[] = [];
  constructor() {}
  register(cellPosition: Point) {
    this.activeAnimationCellPositions.push(cellPosition);
  }
  unregister(_cellPosition: Point) {
    this.activeAnimationCellPositions.pop();
  }
  isEmpty() {
    return this.activeAnimationCellPositions.length === 0;
  }
}

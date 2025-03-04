import { Point } from "./jewel-quartet";

export class AnimationRegistry {
  activeAnimationCellPositions: Record<number, Record<number, boolean>> = {};
  constructor() {}
  register(cellPosition: Point) {
    const { x, y } = cellPosition;

    if (this.activeAnimationCellPositions[y] === undefined)
      this.activeAnimationCellPositions[y] = {};
    this.activeAnimationCellPositions[y][x] = true;
  }
  unregister(cellPosition: Point) {
    const { x, y } = cellPosition;
    if (this.activeAnimationCellPositions[y] !== undefined)
      delete this.activeAnimationCellPositions[y][x];
  }
  isEmpty() {
    let toReturn = true;
    Object.values(this.activeAnimationCellPositions).forEach((row) => {
      if (Object.values(row).length !== 0) toReturn = false;
    });
    return toReturn;
  }
}

import { Grid } from "./grid";
import { JewelType } from "./jewel/jewel-consts";
import { Point } from "./types";

export class JewelQuartet {
  public topLeftPosition: Point;
  public topRightPosition: Point;
  public bottomLeftPosition: Point;
  public bottomRightPosition: Point;
  positions: Point[];
  constructor(public position: Point) {
    this.topLeftPosition = new Point(this.position.x, this.position.y);
    this.topRightPosition = new Point(this.position.x + 1, this.position.y);
    this.bottomRightPosition = new Point(
      this.position.x + 1,
      this.position.y + 1
    );
    this.bottomLeftPosition = new Point(this.position.x, this.position.y + 1);
    this.positions = [
      this.topLeftPosition,
      this.topRightPosition,
      this.bottomRightPosition,
      this.bottomLeftPosition,
    ];
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

  isRotatable(grid: Grid) {
    const jewels = this.getJewels(grid);
    for (const jewel of jewels) {
      if (jewel.jewelType === JewelType.Locked) return false;
    }
    return true;
  }
}

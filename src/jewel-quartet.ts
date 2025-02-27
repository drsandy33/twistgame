import { Grid } from "./grid";

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
  rotate(grid: Grid) {
    const topLeftJewel = grid.getJewelAtPosition(this.topLeftPosition);
    const topRightJewel = grid.getJewelAtPosition(this.topRightPosition);
    const bottomLeftJewel = grid.getJewelAtPosition(this.bottomLeftPosition);
    const bottomRightJewel = grid.getJewelAtPosition(this.bottomRightPosition);
    grid.putJewelInPosition(this.topRightPosition, topLeftJewel);
    grid.putJewelInPosition(this.bottomRightPosition, topRightJewel);
    grid.putJewelInPosition(this.bottomLeftPosition, bottomRightJewel);
    grid.putJewelInPosition(this.topLeftPosition, bottomLeftJewel);
  }
}

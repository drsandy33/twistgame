import { globalContextHolder } from "./App";
import { drawGrid } from "./draw-grid";
import { Jewel } from "./jewel";

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
  selectJewels(grid: Jewel[][]) {
    selectIfExist(this.topLeftPosition, grid);
    selectIfExist(this.topRightPosition, grid);
    selectIfExist(this.bottomLeftPosition, grid);
    selectIfExist(this.bottomRightPosition, grid);
    const context = globalContextHolder.context;
    if (context === null) return;
    drawGrid(grid, context);
  }
  rotate(grid: Jewel[][]) {
    const topLeftJewel = getJewelAtPosition(this.topLeftPosition, grid);
    const topRightJewel = getJewelAtPosition(this.topRightPosition, grid);
    const bottomLeftJewel = getJewelAtPosition(this.bottomLeftPosition, grid);
    const bottomRightJewel = getJewelAtPosition(this.bottomRightPosition, grid);
    putJewelInPosition(this.topRightPosition, grid, topLeftJewel);
    putJewelInPosition(this.bottomRightPosition, grid, topRightJewel);
    putJewelInPosition(this.bottomLeftPosition, grid, bottomRightJewel);
    putJewelInPosition(this.topLeftPosition, grid, bottomLeftJewel);

    const context = globalContextHolder.context;
    if (context === null) return;

    drawGrid(grid, context);
  }
}
function putJewelInPosition(position: Point, grid: Jewel[][], jewel: Jewel) {
  const column = grid[position.x];
  if (column === undefined) throw new Error("expected column not found");
  column[position.y] = jewel;
}
function selectIfExist(position: Point, grid: Jewel[][]) {
  const { x, y } = position;
  const column = grid[x];
  if (column === undefined) return;
  const jewel = column[y];
  if (jewel === undefined) return;
  jewel.isSelected = true;
}
function getJewelAtPosition(position: Point, grid: Jewel[][]) {
  const column = grid[position.x];
  if (column === undefined) throw new Error("expected column not found");
  const jewel = column[position.y];
  if (jewel === undefined) throw new Error("expected jewel not found");
  return jewel;
}

import { GRID_CELL_DIMENSIONS, GRID_PIXEL_DIMENSIONS } from "./app-consts";
import { Jewel, JewelColor, JewelType } from "./jewel";
import { Point } from "./jewel-quartet";
import { iterateNumericEnum, chooseRandomFromArray } from "./utils";
export interface Dimensions {
  width: number;
  height: number;
}
export class Grid {
  rows: Jewel[][];
  pixelDimensions: Dimensions;
  cellDimensions: Dimensions;
  constructor() {
    this.cellDimensions = {
      width: GRID_CELL_DIMENSIONS.COLUMNS,
      height: GRID_CELL_DIMENSIONS.ROWS,
    };
    this.rows = this.makeGrid(
      this.cellDimensions.height,
      this.cellDimensions.width
    );
    this.pixelDimensions = {
      width: GRID_PIXEL_DIMENSIONS.WIDTH,
      height: GRID_PIXEL_DIMENSIONS.HEIGHT,
    };
  }
  makeGrid(numRows: number, numColumns: number) {
    const rows: Jewel[][] = [];
    for (let i = 0; i < numRows; i = i + 1) {
      const row = [];
      for (let j = 0; j < numColumns; j = j + 1) {
        const jewel = createJewel(0);
        row.push(jewel);
      }
      rows.push(row);
    }

    return rows;
  }
  getRow(index: number) {
    const row = this.rows[index];
    if (row === undefined) throw new Error("expected row does not exist");
    return row;
  }

  getJewelPixelPosition(row: number, column: number) {
    const rowHeight = this.pixelDimensions.height / this.cellDimensions.height;
    const columnWidth = this.pixelDimensions.width / this.cellDimensions.width;
    const x = columnWidth * column + columnWidth / 2;
    const y = rowHeight * row + rowHeight / 2;
    return { x, y };
  }
  deselectAllJewels() {
    for (let i = 0; i < this.rows.length; i = i + 1) {
      const row = this.getRow(i);

      for (let j = 0; j < row.length; j = j + 1) {
        const position = new Point(j, i);
        const jewel = this.getJewelAtPosition(position);

        jewel.isSelected = false;
      }
    }
  }
  drawSelf(context: CanvasRenderingContext2D) {
    const { width, height } = this.pixelDimensions;
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < this.rows.length; i = i + 1) {
      const row = this.getRow(i);

      for (let j = 0; j < row.length; j = j + 1) {
        const position = new Point(j, i);
        const jewel = this.getJewelAtPosition(position);

        const jewelPlace = this.getJewelPixelPosition(i, j);
        jewel.drawSelf(context, jewelPlace);
      }
    }
  }
  selectJewelAtPosition(position: Point) {
    const jewel = this.getJewelAtPosition(position);
    jewel.isSelected = true;
  }
  getJewelAtPosition(position: Point) {
    const row = this.getRow(position.y);

    const jewel = row[position.x];
    if (jewel === undefined) throw new Error("expected jewel not found");
    return jewel;
  }
  putJewelInPosition(position: Point, jewel: Jewel) {
    const row = this.getRow(position.y);
    row[position.x] = jewel;
  }
}
function createJewel(_level: number) {
  const allColors = iterateNumericEnum(JewelColor);
  const randColor = chooseRandomFromArray(allColors);
  return new Jewel(randColor, JewelType.Normal, 0);
}

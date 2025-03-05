import { GRID_CELL_DIMENSIONS, GRID_PIXEL_DIMENSIONS } from "./app-consts";

import { Jewel } from "./jewel";
import { Point } from "./jewel-quartet";
import { JewelColor, JewelType } from "./jewel/jewel-consts";
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
        const jewelPlace = getJewelPixelPosition(i, j);
        const jewel = createJewel(0, jewelPlace);
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
  getAllJewels() {
    const jewels: Jewel[] = [];
    for (let i = 0; i < this.rows.length; i = i + 1) {
      const row = this.getRow(i);

      for (let j = 0; j < row.length; j = j + 1) {
        const position = new Point(j, i);
        const jewel = this.getJewelAtPosition(position);
        jewels.push(jewel);
      }
    }
    return jewels;
  }
  getColumns() {
    const columns: Jewel[][] = [];
    for (
      let column = 0;
      column < this.cellDimensions.width;
      column = column + 1
    ) {
      const columnJewels: Jewel[] = [];
      this.rows.forEach((row) => {
        const jewel = row[column];
        if (jewel === undefined)
          throw new Error("expected jewel does not exist");
        columnJewels.push(jewel);
      });
      columns.push(columnJewels);
    }
    return columns;
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

        jewel.drawSelf(context);
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
export function createJewel(_level: number, pixelPosition: Point) {
  const allColors = iterateNumericEnum(JewelColor);
  const randColor = chooseRandomFromArray(allColors);

  return new Jewel(randColor, JewelType.Normal, 0, pixelPosition);
}
export function getJewelPixelPosition(row: number, column: number) {
  const rowHeight = GRID_PIXEL_DIMENSIONS.HEIGHT / GRID_CELL_DIMENSIONS.ROWS;
  const columnWidth =
    GRID_PIXEL_DIMENSIONS.WIDTH / GRID_CELL_DIMENSIONS.COLUMNS;
  const x = columnWidth * column + columnWidth / 2;
  const y = rowHeight * row + rowHeight / 2;
  return { x, y };
}

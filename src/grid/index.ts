import { SetStateAction } from "react";
import {
  COUNTING_JEWEL_BASE_START_COUNT,
  GRID_CELL_DIMENSIONS,
  GRID_PIXEL_DIMENSIONS,
  JEWEL_TYPE_CHANCES_BY_LEVEL,
} from "../app-consts";
import { Jewel } from "../jewel";
import { Point } from "../types";
import { JewelColor, JewelType } from "../jewel/jewel-consts";
import {
  iterateNumericEnum,
  chooseRandomFromArray,
  iterateNumericEnumKeyedRecord,
} from "../utils";
import { GameEventType } from "../game-event-manager";
import { Match } from "../match-checker";

export interface Dimensions {
  width: number;
  height: number;
}

export class Grid {
  rows: Jewel[][];
  pixelDimensions: Dimensions;
  cellDimensions: Dimensions;
  isGameOver: boolean = false;
  numJewelsSetter: React.Dispatch<SetStateAction<number>> | null = null;
  numJewelsRemovedSetter: React.Dispatch<SetStateAction<number>> | null = null;
  isGameOverSetter: React.Dispatch<SetStateAction<boolean>> | null = null;
  numJewelsRemoved: number = 0;
  currentlyProcessingGameEventTypeSetter: React.Dispatch<
    SetStateAction<GameEventType | null>
  > | null = null;

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
  updateScore(update: number) {
    this.numJewelsRemoved += update;
    if (this.numJewelsRemovedSetter !== null)
      this.numJewelsRemovedSetter(this.numJewelsRemoved);
  }
  getCurrentLevel() {
    // Define the base points required for the first level
    const basePoints = 10;
    // Define the growth factor for the geometric progression
    const growthFactor = 2;

    // Calculate the level based on the points
    let level = 0;
    let requiredPoints = basePoints;

    while (this.numJewelsRemoved >= requiredPoints) {
      level++;
      requiredPoints *= growthFactor; // Increase the required points geometrically
    }

    return level;
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

  markMatchedJewelsAndStopCountingMatchedJewels(matches: Match[]) {
    matches.forEach((match) => {
      match.jewelPositions.forEach((jewelCellPosition) => {
        const jewel = this.getJewelAtPosition(jewelCellPosition);
        jewel.isPartOfMatch = true;
        if (jewel.jewelType === JewelType.Counting)
          jewel.jewelType = JewelType.Normal;
      });
    });
  }

  drawSelf(context: CanvasRenderingContext2D) {
    const { width, height } = this.pixelDimensions;
    context.clearRect(0, 0, width, height);
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
  updateCountingJewels() {
    this.getAllJewels().forEach((jewel) => {
      if (jewel.jewelType !== JewelType.Counting) return;
      jewel.count -= 1;
    });
  }
  checkForGameOver() {
    console.log("checking for game over");
    this.getAllJewels().forEach((jewel) => {
      if (jewel.jewelType !== JewelType.Counting) return;

      if (jewel.count <= 0) {
        if (!this.isGameOverSetter)
          throw new Error("game over setter was not found");
        this.isGameOverSetter(true);
        this.isGameOver = true;
      }
    });
  }
}
export function createJewel(level: number, pixelPosition: Point) {
  const random = Math.random();
  let min = 0;
  let selectedJewelType = JewelType.Normal;
  let selectedCount = 0;
  const allColors = iterateNumericEnum(JewelColor).filter(
    (jewelColor) => jewelColor !== JewelColor.Rock
  );
  let selectedColor: JewelColor = chooseRandomFromArray(allColors);
  for (const [jewelType, chance] of iterateNumericEnumKeyedRecord(
    JEWEL_TYPE_CHANCES_BY_LEVEL
  )) {
    const chanceOnThisLevel = chance * level;
    if (random > min && random <= min + chanceOnThisLevel) {
      selectedJewelType = jewelType;
      if (jewelType === JewelType.Rock) selectedColor = JewelColor.Rock;
      if (jewelType === JewelType.Counting) {
        const baseStartCount = COUNTING_JEWEL_BASE_START_COUNT - level;
        const countRangeSize = 1;
        let randomSign = 1;
        if (Math.random() > 0.5) randomSign = -1;
        selectedCount = Math.max(
          1,
          baseStartCount + countRangeSize * randomSign
        );
      }
    }
    min += chanceOnThisLevel;
  }

  return new Jewel(
    selectedColor,
    selectedJewelType,
    selectedCount,
    pixelPosition
  );
}
export function getJewelPixelPosition(row: number, column: number) {
  const rowHeight = GRID_PIXEL_DIMENSIONS.HEIGHT / GRID_CELL_DIMENSIONS.ROWS;
  const columnWidth =
    GRID_PIXEL_DIMENSIONS.WIDTH / GRID_CELL_DIMENSIONS.COLUMNS;
  const x = columnWidth * column + columnWidth / 2;
  const y = rowHeight * row + rowHeight / 2;
  return new Point(x, y);
}

import { JewelColor, Jewel, JewelType } from "./jewel";
import { iterateNumericEnum, chooseRandomFromArray } from "./utils";

export function makeGrid(rows: number, columns: number) {
  const jeweledGrid: Jewel[][] = [];
  for (let i = 0; i < rows; i = i + 1) {
    const row = [];
    for (let j = 0; j < columns; j = j + 1) {
      const jewel = createJewel(0);
      row.push(jewel);
    }
    jeweledGrid.push(row);
  }

  return jeweledGrid;
}
export function getJewelPosition(
  row: number,
  column: number,
  gridHeight: number,
  gridWidth: number,
  numRows: number,
  numColumns: number
) {
  const rowSize = gridWidth / numRows;
  const colSize = gridHeight / numColumns;
  const x = colSize * column + colSize / 2;
  const y = rowSize * row + rowSize / 2;
  return { x, y };
}
function makeSubGrid() {}
function findCursor() {}
function drawCircle() {}

function turn() {}
function threematch() {}
function removeElement() {}
function fillEmpty() {}
function createJewel(level: number) {
  const allColors = iterateNumericEnum(JewelColor);
  const randColor = chooseRandomFromArray(allColors);
  return new Jewel(randColor, JewelType.Normal, 0);
}

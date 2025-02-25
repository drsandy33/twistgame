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

function rotate() {}
function threematch() {}
function removeElement() {}
function fillEmpty() {}

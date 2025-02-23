import { globalContextHolder, grid } from "./App";
import "./App.css";
import { JEWEL_DIAMETER, SELECT_GRID_SIZE } from "./app-consts";
import { drawGrid } from "./draw-grid";
interface SelectBoxProps {
  x: number;
  y: number;
}
export function SelectBox(selectBoxProps: SelectBoxProps) {
  const topLeftPosition = { x: selectBoxProps.x, y: selectBoxProps.y };
  const topRightPosition = { x: selectBoxProps.x + 1, y: selectBoxProps.y };
  const bottomLeftPosition = { x: selectBoxProps.x, y: selectBoxProps.y + 1 };
  const bottomRightPosition = {
    x: selectBoxProps.x + 1,
    y: selectBoxProps.y + 1,
  };
  function handleMouseLeave() {
    deselectJewels();
    const context = globalContextHolder.context;
    if (context === null) return;
    drawGrid(grid, context);
  }
  function selectJewels() {
    selectIfExist(topLeftPosition.x, topLeftPosition.y);
    selectIfExist(topRightPosition.x, topRightPosition.y);
    selectIfExist(bottomLeftPosition.x, bottomLeftPosition.y);
    selectIfExist(bottomRightPosition.x, bottomRightPosition.y);
    const context = globalContextHolder.context;
    if (context === null) return;
    drawGrid(grid, context);
  }
  function deselectJewels() {
    for (let i = 0; i < grid.length; i = i + 1) {
      const row = grid[i];
      if (row === undefined) throw new Error("expected does not exist");
      for (let j = 0; j < row.length; j = j + 1) {
        const jewel = row[j];
        if (jewel === undefined)
          throw new Error("expected jewel does not exist");

        jewel.isSelected = false;
      }
    }
  }
  function selectIfExist(x: number, y: number) {
    const column = grid[x];
    if (column === undefined) return;
    const jewel = column[y];
    if (jewel === undefined) return;
    jewel.isSelected = true;
  }

  return (
    <button
      className="select-box"
      style={{ height: JEWEL_DIAMETER, width: JEWEL_DIAMETER }}
      onMouseEnter={selectJewels}
      onMouseLeave={handleMouseLeave}
    >
      {selectBoxProps.x}, {selectBoxProps.y}
    </button>
  );
}
export function SelectGrid() {
  const rows = [];
  for (let i = 0; i < SELECT_GRID_SIZE.COLUMNS; i = i + 1) {
    const column = [];
    for (let j = 0; j < SELECT_GRID_SIZE.ROWS; j = j + 1) {
      column.push(<SelectBox x={i} y={j} />);
    }
    rows.push(column);
  }
  return (
    <div
      className="select-grid"
      style={{ top: JEWEL_DIAMETER / 2, left: JEWEL_DIAMETER / 2 }}
    >
      {rows}
    </div>
  );
}

import { gameEventManager, grid } from "./App";
import "./App.css";
import { JEWEL_DIAMETER, SELECT_GRID_SIZE } from "./app-consts";
import { JewelRemovalsGameEvent } from "./game-event-manager/jewel-removals";
import { QuartetRotationGameEvent } from "./game-event-manager/jewel-rotation";
import { JewelQuartet, Point } from "./jewel-quartet";

interface SelectBoxProps {
  x: number;
  y: number;
}
export function SelectBox(selectBoxProps: SelectBoxProps) {
  const quartet = new JewelQuartet(
    new Point(selectBoxProps.x, selectBoxProps.y)
  );

  function handleMouseLeave() {
    grid.deselectAllJewels();
  }

  function handleMouseDown() {
    if (gameEventManager.isProcessing())
      return console.log("click not allowed while processing");
    gameEventManager.addEvent(new QuartetRotationGameEvent(quartet));
  }

  return (
    <button
      className="select-box"
      style={{ height: JEWEL_DIAMETER, width: JEWEL_DIAMETER }}
      onMouseEnter={() => quartet.selectJewels(grid)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    ></button>
  );
}
export function SelectGrid() {
  const rows = [];
  for (let i = 0; i < SELECT_GRID_SIZE.COLUMNS; i = i + 1) {
    const column = [];
    for (let j = 0; j < SELECT_GRID_SIZE.ROWS; j = j + 1) {
      column.push(<SelectBox x={j} y={i} key={i + j} />);
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

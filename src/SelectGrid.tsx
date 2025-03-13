import { useEffect, useRef, useState } from "react";
import { gameSingletonHolder } from "./App";
import "./App.css";
import {
  DISABLED_FLASH_TIMEOUT_DURATION,
  JEWEL_DIAMETER,
  SELECT_GRID_SIZE,
} from "./app-consts";
import { QuartetRotationGameEvent } from "./game-event-manager/jewel-rotation";
import { JewelQuartet } from "./jewel-quartet";
import SelectCircle from "./assets/selection-circle.svg?react";
import { Point } from "./types";
import { useGameStore } from "./stores/game-store";

interface SelectBoxProps {
  x: number;
  y: number;
}
export function SelectBox(selectBoxProps: SelectBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [flashingDisabled, setFlashingDisabled] = useState(false);
  const flashingDisabledTimeoutRef = useRef<number>(null);

  const quartet = new JewelQuartet(
    new Point(selectBoxProps.x, selectBoxProps.y)
  );

  useEffect(() => {
    return () => {
      if (flashingDisabledTimeoutRef.current) {
        clearTimeout(flashingDisabledTimeoutRef.current);
      }
    };
  }, []);

  function handleMouseLeave() {
    if (!gameSingletonHolder.game) return console.log("no game");
    const { grid } = gameSingletonHolder.game;
    setIsHovered(false);
    grid.deselectAllJewels();
  }
  function handleMouseEnter() {
    if (!gameSingletonHolder.game) return;
    const { grid } = gameSingletonHolder.game;
    quartet.selectJewels(grid);
    setIsHovered(true);
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (!gameSingletonHolder.game) return;
    const { grid, gameEventManager } = gameSingletonHolder.game;
    if (e.button !== 0) return;
    const clickIsForbidden =
      useGameStore.getState().isGameOver ||
      gameEventManager.isProcessing() ||
      !quartet.isRotatable(grid);

    if (clickIsForbidden) {
      if (flashingDisabledTimeoutRef.current)
        clearTimeout(flashingDisabledTimeoutRef.current);
      setFlashingDisabled(true);
      flashingDisabledTimeoutRef.current = setTimeout(() => {
        setFlashingDisabled(false);
      }, DISABLED_FLASH_TIMEOUT_DURATION);
      return;
    }

    gameEventManager.addEvent(
      new QuartetRotationGameEvent(quartet, gameSingletonHolder.game)
    );
  }

  // const { x, y } = selectBoxProps;
  // const isSideEdge = x === 0 || x === GRID_CELL_DIMENSIONS.COLUMNS - 2;
  // const sideEdgeWidth = isSideEdge ? JEWEL_DIAMETER / 2 : 0;
  // const isVerticalEdge = y === 0 || y === GRID_CELL_DIMENSIONS.ROWS - 2;
  // const verticalEdgeWidth = isVerticalEdge ? JEWEL_DIAMETER / 2 : 0;

  return (
    <button
      className="select-box"
      style={{
        height: JEWEL_DIAMETER,
        width: JEWEL_DIAMETER,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    >
      {
        // isHovered && <div className="selection-circle" />
      }
      {isHovered && (
        <div>
          <div className="selection-circle-container">
            <SelectCircle
              className="selection-circle-svg"
              style={{ fill: flashingDisabled ? "red" : "grey" }}
            />
          </div>
          <div className="selection-circle-container">
            <SelectCircle
              className="selection-circle-svg"
              style={{ zIndex: 10 }}
            />
          </div>
        </div>
      )}
    </button>
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
      // style={{ top: 0, left: 0 }}
    >
      {rows}
    </div>
  );
}

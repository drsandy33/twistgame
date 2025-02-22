import { useEffect } from "react";
import "./App.css";
import { getJewelPosition, makeGrid } from "./game";

import { GRID_PIXEL_DIMENSIONS, GRID_SIZE } from "./app-consts";
import { SelectGrid } from "./SelectBox";

function App() {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    console.log(canvas);
    if (canvas === null) return;
    const context = canvas.getContext("2d");
    if (context === null) return;
    const grid = makeGrid(8, 8);

    for (let i = 0; i < grid.length; i = i + 1) {
      const row = grid[i];
      if (row === undefined) throw new Error("expected does not exist");
      for (let j = 0; j < row.length; j = j + 1) {
        const jewel = row[j];
        if (jewel === undefined)
          throw new Error("expected jewel does not exist");
        const jewelPlace = getJewelPosition(
          i,
          j,
          GRID_PIXEL_DIMENSIONS.HEIGHT,
          GRID_PIXEL_DIMENSIONS.WIDTH,
          GRID_SIZE.ROWS,
          GRID_SIZE.COLUMNS
        );
        jewel.drawSelf(context, jewelPlace);
      }
    }
  }, []);

  return (
    <div className="main-container">
      <div className="all-grids">
        <canvas
          height={GRID_PIXEL_DIMENSIONS.HEIGHT}
          width={GRID_PIXEL_DIMENSIONS.WIDTH}
          className="canvas"
        ></canvas>
        <SelectGrid />
      </div>
    </div>
  );
}

export default App;

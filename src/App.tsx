import { useEffect } from "react";
import "./App.css";
import { getJewelPosition, makeGrid } from "./game";

import { GRID_PIXEL_DIMENSIONS, GRID_SIZE } from "./app-consts";
import { SelectGrid } from "./SelectGrid";
import { drawGrid } from "./draw-grid";
export const grid = makeGrid(8, 8);
export const globalContextHolder: { context: null | CanvasRenderingContext2D } =
  { context: null };
function App() {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    console.log(canvas);
    if (canvas === null) return;
    const context = canvas.getContext("2d");
    if (context === null) return;
    globalContextHolder.context = context;

    drawGrid(grid, context);
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

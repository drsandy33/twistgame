import { useEffect } from "react";
import "./App.css";
import { GRID_PIXEL_DIMENSIONS } from "./app-consts";
import { SelectGrid } from "./SelectGrid";
import { Grid } from "./grid";

export const grid = new Grid();
export const globalContextHolder: { context: null | CanvasRenderingContext2D } =
  { context: null };

function App() {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas === null) return;
    const context = canvas.getContext("2d");
    if (context === null) return;
    globalContextHolder.context = context;

    grid.drawSelf(context);
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

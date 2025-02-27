import { useEffect, useRef } from "react";
import "./App.css";
import { GRID_PIXEL_DIMENSIONS, RENDER_INTERVAL } from "./app-consts";
import { SelectGrid } from "./SelectGrid";
import { Grid } from "./grid";
import { updateCanvas } from "./update-canvas";

export const grid = new Grid();
export const globalContextHolder: { context: null | CanvasRenderingContext2D } =
  { context: null };

function App() {
  const animationFrameRef = useRef<number>(null);
  const lastRenderTimestampRef = useRef(0);
  function render(timestamp: number, context: CanvasRenderingContext2D) {
    if (timestamp - lastRenderTimestampRef.current >= RENDER_INTERVAL) {
      updateCanvas(context);
    }
    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      render(timestamp, context);
    });
  }
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas === null) return;
    const context = canvas.getContext("2d");
    if (context === null) return;
    globalContextHolder.context = context;

    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      render(timestamp, context);
    });
    return () => {
      if (animationFrameRef.current !== null)
        cancelAnimationFrame(animationFrameRef.current);
    };
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

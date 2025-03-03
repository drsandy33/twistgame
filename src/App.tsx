import { useEffect, useRef, useState } from "react";
import "./App.css";
import { GRID_PIXEL_DIMENSIONS, RENDER_INTERVAL } from "./app-consts";
import { SelectGrid } from "./SelectGrid";
import { Grid } from "./grid";
import { updateCanvas } from "./update-canvas";
import { ImageManager } from "./image-manager";
import { JEWEL_COLOR_URLS } from "./jewel";
import { MatchChecker } from "./match-checker";
import { GridRefiller } from "./grid-refiller";

export const grid = new Grid();
export const gridRefiller = new GridRefiller(grid);
export const globalContextHolder: { context: null | CanvasRenderingContext2D } =
  { context: null };
export const imageManager = new ImageManager();

function App() {
  const [loading, setLoading] = useState(true);
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
    const jewelImageURLs = Object.values(JEWEL_COLOR_URLS);
    imageManager.loadImages(jewelImageURLs, () => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    const canvas = document.querySelector("canvas");
    if (canvas === null) return;
    const context = canvas.getContext("2d");
    if (context === null) return;
    globalContextHolder.context = context;
    //context.translate(0, 100);

    gridRefiller.createReplacements();

    const matchChecker = new MatchChecker(grid);
    matchChecker.checkForMatches();

    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      render(timestamp, context);
    });
    return () => {
      if (animationFrameRef.current !== null)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [loading]);

  if (loading) return "loading";

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

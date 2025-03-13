import { useEffect, useRef, useState } from "react";
import "./App.css";
import { GRID_PIXEL_DIMENSIONS, RENDER_INTERVAL } from "./app-consts";
import { SelectGrid } from "./SelectGrid";
import { updateCanvas } from "./update-canvas";
import { ImageManager } from "./image-manager";

import { MatchChecker } from "./match-checker";
import { GridRefiller } from "./grid-refiller";
import {
  JEWEL_COLOR_URLS,
  JEWEL_TYPE_INDICATOR_URLS,
} from "./jewel/jewel-consts";
import {
  GAME_EVENT_TYPE_STRINGS,
  GameEventManager,
  GameEventType,
} from "./game-event-manager";
import { Grid } from "./grid";

export const grid = new Grid();
export const matchChecker = new MatchChecker(grid);
export const gridRefiller = new GridRefiller(grid);
export const gameEventManager = new GameEventManager();
export const imageManager = new ImageManager();

function App() {
  const [loading, setLoading] = useState(true);
  const [numJewels, setNumJewels] = useState(0);
  const [numJewelsRemoved, setNumJewelsRemoved] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const [currentlyProcessingEventType, setCurrentlyProcessingEventType] =
    useState<null | GameEventType>(null);
  const animationFrameRef = useRef<number>(null);
  const lastRenderTimestampRef = useRef(0);

  function tick(timestamp: number, context: CanvasRenderingContext2D) {
    gameEventManager.process();

    if (timestamp - lastRenderTimestampRef.current >= RENDER_INTERVAL) {
      updateCanvas(context);
    }
    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      tick(timestamp, context);
    });
  }
  useEffect(() => {
    const jewelImageURLs = Object.values(JEWEL_COLOR_URLS);
    const indicatorURLs = Object.values(JEWEL_TYPE_INDICATOR_URLS);
    const allURLs = jewelImageURLs.concat(indicatorURLs);
    imageManager.loadImages(allURLs, () => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    const canvas = document.querySelector("canvas");
    if (canvas === null) return;
    const context = canvas.getContext("2d");
    if (context === null) return;

    // context.translate(0, 100);

    grid.numJewelsSetter = setNumJewels;
    grid.numJewelsRemovedSetter = setNumJewelsRemoved;
    grid.isGameOverSetter = setIsGameOver;
    grid.currentlyProcessingGameEventTypeSetter =
      setCurrentlyProcessingEventType;

    animationFrameRef.current = requestAnimationFrame((timestamp) => {
      tick(timestamp, context);
    });
    return () => {
      if (animationFrameRef.current !== null)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [loading]);

  if (loading) return "loading";

  function handleNewGameClick() {
    setNumJewelsRemoved(0);
    grid.rows = grid.makeGrid(
      grid.cellDimensions.height,
      grid.cellDimensions.width
    );
    setIsGameOver(false);
    grid.isGameOver = false;
  }

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
      <div style={{ padding: "2px" }}>Num Jewels: {numJewels}</div>
      <div style={{ padding: "2px" }}>
        Current event processing:{" "}
        {currentlyProcessingEventType !== null
          ? GAME_EVENT_TYPE_STRINGS[currentlyProcessingEventType]
          : "null"}
      </div>
      <div style={{ padding: "2px" }}>score: {numJewelsRemoved}</div>
      <div style={{ padding: "2px" }}>level: {grid.getCurrentLevel()}</div>
      <div style={{ padding: "2px" }}>
        isGameOver: {isGameOver ? "true" : "false"}
      </div>
      <dialog open={isGameOver} className="dialog">
        <h3>GAME OVER !!!</h3>
        <button onClick={handleNewGameClick}>Play Again</button>
      </dialog>
    </div>
  );
}

export default App;

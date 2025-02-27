import { grid } from "./App";

export function updateCanvas(context: CanvasRenderingContext2D) {
  grid.drawSelf(context);
}

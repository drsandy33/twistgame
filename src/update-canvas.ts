import { grid } from "./App";

export function updateCanvas(context: CanvasRenderingContext2D) {
  grid.getAllJewels().forEach((jewel) => {
    if (!jewel.rotationAnimation) return;
    const animationIsComplete = jewel.rotationAnimation.update();
    if (animationIsComplete) jewel.rotationAnimation = null;
  });
  grid.drawSelf(context);
}

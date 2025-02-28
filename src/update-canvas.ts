import { grid } from "./App";

export function updateCanvas(context: CanvasRenderingContext2D) {
  grid.getAllJewels().forEach((jewel) => {
    if (jewel.rotationAnimation) {
      const rotationAnimationIsComplete = jewel.rotationAnimation.update();
      if (rotationAnimationIsComplete) jewel.rotationAnimation = null;
    }
    if (jewel.fadeoutAnimation) {
      const fadeoutAnimationIsComplete = jewel.fadeoutAnimation?.update();
      if (fadeoutAnimationIsComplete) jewel.fadeoutAnimation = null;
    }
  });
  grid.drawSelf(context);
}

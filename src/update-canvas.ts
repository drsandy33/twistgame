import { grid, gridRefiller } from "./App";
import { Jewel } from "./jewel";
import { JewelAnimation } from "./jewel/animation";

export function updateCanvas(context: CanvasRenderingContext2D) {
  const jewelsToUpdate: Jewel[] = grid.getAllJewels();

  gridRefiller.replacements?.forEach((column) => {
    jewelsToUpdate.push(...column);
  });

  jewelsToUpdate.forEach((jewel) => {
    const animationsToKeep: JewelAnimation[] = [];
    jewel.animations.forEach((animation) => {
      animation.update();

      if (animation.isComplete()) {
        animation.onComplete();
      } else {
        animationsToKeep.push(animation);
      }
    });
    jewel.animations = animationsToKeep;
  });

  grid.drawSelf(context);

  jewelsToUpdate.forEach((jewel) => {
    jewel.drawSelf(context);
  });
}

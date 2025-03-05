import cloneDeep from "lodash.clonedeep";
import {
  animationRegistry,
  grid,
  gridRefiller,
  gridUpdater,
  inputManager,
  matchChecker,
} from "./App";
import { Point } from "./jewel-quartet";
import { FadeoutAnimation } from "./jewel/fadeout-animation";
import { TranslationAnimation } from "./jewel/translation-animation";
import { JewelType } from "./jewel/jewel-consts";

export function queueGridEvaluation() {
  gridUpdater.shouldUpdateOnNextFrame = true;
}

export function evaluateAndUpdateGrid() {
  const matches = matchChecker.checkForMatches();
  matches.forEach((match) => {
    if (match.length === 3) {
      match.forEach((jewelPosition) => {
        const jewel = grid.getJewelAtPosition(jewelPosition);
        jewel.fadeoutAnimation = new FadeoutAnimation(jewel, () => {});
      });
    } else if (match.length === 4) {
      const fireJewelPosition = getFireJewelPosition(match);
      const fireJewel = grid.getJewelAtPosition(fireJewelPosition);
      fireJewel.isPartOfMatch = false;
      fireJewel.jewelType = JewelType.Fire;
      match.forEach((jewelPosition) => {
        const currentJewel = grid.getJewelAtPosition(jewelPosition);

        currentJewel.coalescingAnimation = new TranslationAnimation(
          cloneDeep(currentJewel.pixelPosition),
          fireJewel.pixelPosition,
          currentJewel,
          () => {
            //animationRegistry.unregister(currentJewelCellPosition);
            // const allFallingAnimationsFinished = animationRegistry.isEmpty();
            // if (allFallingAnimationsFinished)
            //   gridUpdater.shouldUpdateOnNextFrame = true;
          }
        );
      });
    }
  });
  if (matches.length === 0) inputManager.isLocked = false;
  gridRefiller.createReplacements();
  gridUpdater.shouldUpdateOnNextFrame = false;
}

function getFireJewelPosition(match: Point[]) {
  let fireJewelPosition: Point | null = null;
  match.forEach((jewelPosition, i) => {
    if (fireJewelPosition !== null) return;
    if (i === 0) return;
    const jewel = grid.getJewelAtPosition(jewelPosition);
    if ((i === 1 || i === 2) && jewel.justMoved)
      fireJewelPosition = jewelPosition;
    else {
      const rightMostMiddleJewelPosition = match[2];
      if (rightMostMiddleJewelPosition === undefined)
        throw new Error("expected jewel position not found");
      fireJewelPosition = rightMostMiddleJewelPosition;
    }
  });
  if (fireJewelPosition === null)
    throw new Error("failed to find fire jewel position");
  return fireJewelPosition;
}

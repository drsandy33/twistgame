import cloneDeep from "lodash.clonedeep";
import { GameEvent, GameEventType } from ".";
import { AnimationRegistry } from "../animation-registry";
import { gameEventManager, grid, matchChecker } from "../App";
import { Point } from "../jewel-quartet";
import { FadeoutAnimation } from "../jewel/fadeout-animation";
import { JewelType } from "../jewel/jewel-consts";
import { TranslationAnimation } from "../jewel/translation-animation";
import { ColumnRefillsGameEvent } from "./column-refills";

export class JewelRemovalsGameEvent extends GameEvent {
  animationRegistry = new AnimationRegistry();
  numJewelsMarkedForRemoval = 0;
  constructor() {
    super(GameEventType.JewelRemovals);
  }

  start(): void {
    const matches = matchChecker.checkForMatches();
    grid.markMatchedJewels(matches);

    if (matches.length === 0) this.isComplete = true;

    matches.forEach((match) => {
      if (match.length === 3 || match.length > 4) {
        match.forEach((jewelPosition) => {
          const jewel = grid.getJewelAtPosition(jewelPosition);
          this.animationRegistry.register(jewelPosition);
          jewel.fadeoutAnimation = new FadeoutAnimation(jewel, () => {
            this.animationRegistry.unregister(jewelPosition);
            if (this.animationRegistry.isEmpty()) this.isComplete = true;
          });
          jewel.shouldBeReplaced = true;
          this.numJewelsMarkedForRemoval += 1;
        });
      } else if (match.length === 4) {
        const fireJewelPosition = getFireJewelPosition(match);
        const fireJewel = grid.getJewelAtPosition(fireJewelPosition);
        fireJewel.jewelType = JewelType.Fire;

        match.forEach((jewelPosition) => {
          const currentJewel = grid.getJewelAtPosition(jewelPosition);
          if (currentJewel.jewelType === JewelType.Fire)
            return console.log("fire jewel skipped"); // skip the fire jewel

          this.animationRegistry.register(jewelPosition);
          currentJewel.coalescingAnimation = new TranslationAnimation(
            cloneDeep(currentJewel.pixelPosition),
            cloneDeep(fireJewel.pixelPosition),
            currentJewel,
            () => {
              currentJewel.coalescingAnimation = null;
              this.animationRegistry.unregister(jewelPosition);

              currentJewel.shouldBeReplaced = true;
              this.numJewelsMarkedForRemoval += 1;

              if (this.animationRegistry.isEmpty()) this.isComplete = true;
            }
          );
        });
      } else {
        // handle lightning
      }
    });
  }

  onComplete(): void {
    if (this.numJewelsMarkedForRemoval > 0)
      gameEventManager.addEvent(new ColumnRefillsGameEvent());
  }
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

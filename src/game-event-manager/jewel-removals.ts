import cloneDeep from "lodash.clonedeep";
import { GameEvent, GameEventType } from ".";
import { AnimationRegistry } from "../animation-registry";
import { gameEventManager, grid, matchChecker } from "../App";
import { Point } from "../jewel-quartet";
import { FadeoutAnimation } from "../jewel/fadeout-animation";
import { JewelType } from "../jewel/jewel-consts";
import { TranslationAnimation } from "../jewel/translation-animation";
import { ColumnRefillsGameEvent } from "./column-refills";
import { Match } from "../match-checker";
import { GRID_CELL_DIMENSIONS, MINIMUM_MATCH_LENGTH } from "../app-consts";

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
    grid.explosionPositions.length = 0;
    matches.forEach((match) => {
      match.jewelPositions.forEach((jewelPosition) => {
        this.handleFireJewelRemoval(jewelPosition);
      });
    });

    matches.forEach((match) => {
      if (match.jewelPositions.length === MINIMUM_MATCH_LENGTH) {
        match.jewelPositions.forEach((jewelPosition) => {
          const jewel = grid.getJewelAtPosition(jewelPosition);
          this.animationRegistry.register(jewelPosition);
          jewel.fadeoutAnimation = new FadeoutAnimation(jewel, () => {
            this.animationRegistry.unregister(jewelPosition);
            if (this.animationRegistry.isEmpty()) this.isComplete = true;
          });
          jewel.shouldBeReplaced = true;
          this.numJewelsMarkedForRemoval += 1;
        });
      } else if (match.longestAxisLength < 5) {
        const newFireJewelPosition = getFireJewelPosition(match);
        if (newFireJewelPosition === null)
          throw new Error("failed to find fire jewel position");
        const newFireJewel = grid.getJewelAtPosition(newFireJewelPosition);
        newFireJewel.jewelType = JewelType.Fire;
        if (newFireJewel.shouldBeReplaced) {
          newFireJewel.shouldBeReplaced = false;
          newFireJewel.opacity = 1;
          this.numJewelsMarkedForRemoval -= 1;
        }

        match.jewelPositions.forEach((jewelPosition) => {
          const currentJewel = grid.getJewelAtPosition(jewelPosition);
          if (newFireJewelPosition.isEqual(jewelPosition))
            return console.log("fire jewel skipped"); // skip the fire jewel

          this.animationRegistry.register(jewelPosition);
          currentJewel.coalescingAnimation = new TranslationAnimation(
            cloneDeep(currentJewel.pixelPosition),
            cloneDeep(newFireJewel.pixelPosition),
            currentJewel,
            () => {
              currentJewel.coalescingAnimation = null;
              this.animationRegistry.unregister(jewelPosition);

              currentJewel.shouldBeReplaced = true;
              this.numJewelsMarkedForRemoval += 1;

              currentJewel.opacity = 0;
              if (this.animationRegistry.isEmpty()) this.isComplete = true;
            }
          );
        });
      } else {
        // handle lightning
      }
    });
  }

  handleFireJewelRemoval(jewelPosition: Point) {
    const jewel = grid.getJewelAtPosition(jewelPosition);
    if (jewel.jewelType === JewelType.Fire) {
      const explosionPositions = getExplosionPositions(jewelPosition);
      grid.explosionPositions.push(...explosionPositions);
      explosionPositions.forEach((affectedPosition) => {
        if (
          affectedPosition.x < 0 ||
          affectedPosition.x > GRID_CELL_DIMENSIONS.COLUMNS - 1 ||
          affectedPosition.y < 0 ||
          affectedPosition.y > GRID_CELL_DIMENSIONS.ROWS - 1
        )
          return;
        const affectedJewel = grid.getJewelAtPosition(affectedPosition);
        if (affectedJewel.shouldBeReplaced) return;
        affectedJewel.shouldBeReplaced = true;
        this.numJewelsMarkedForRemoval += 1;
        affectedJewel.opacity = 0;
        if (affectedJewel.jewelType === JewelType.Fire)
          this.handleFireJewelRemoval(affectedPosition);
      });
    }
  }

  onComplete(): void {
    if (this.numJewelsMarkedForRemoval > 0)
      gameEventManager.addEvent(new ColumnRefillsGameEvent());
  }
}

function getFireJewelPosition(match: Match): null | Point {
  if (match.predeterminedSpecialJewelPositionOption)
    return match.predeterminedSpecialJewelPositionOption;
  let fireJewelPosition: Point | null = null;
  match.jewelPositions.forEach((jewelPosition, i) => {
    if (fireJewelPosition !== null) return;
    if (i === 0) return;
    const jewel = grid.getJewelAtPosition(jewelPosition);
    if ((i === 1 || i === 2) && jewel.justMoved)
      fireJewelPosition = jewelPosition;
    else {
      const rightMostMiddleJewelPosition = match.jewelPositions[2];
      if (rightMostMiddleJewelPosition === undefined)
        throw new Error("expected jewel position not found");
      fireJewelPosition = rightMostMiddleJewelPosition;
    }
  });
  if (fireJewelPosition === null)
    throw new Error("failed to find fire jewel position");
  return fireJewelPosition;
}

function getExplosionPositions(center: Point) {
  const positions: Point[] = [];

  for (let rowIndex = -1; rowIndex < 2; rowIndex += 1) {
    for (let i = -1; i < 2; i += 1) {
      positions.push(new Point(center.x + i, center.y + rowIndex));
    }
  }
  return positions;
}

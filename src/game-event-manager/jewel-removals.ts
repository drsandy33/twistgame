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
import {
  GRID_CELL_DIMENSIONS,
  JEWEL_TYPE_CHANCES_BY_LEVEL,
  MINIMUM_MATCH_LENGTH,
} from "../app-consts";

export class JewelRemovalsGameEvent extends GameEvent {
  animationRegistry = new AnimationRegistry();
  numJewelsMarkedForRemoval = 0;
  constructor() {
    super(GameEventType.JewelRemovals);
  }

  start(): void {
    this.isComplete = true;
    const matches = matchChecker.checkForMatches();
    grid.markMatchedJewels(matches);

    if (matches.length === 0) this.isComplete = true;

    matches.forEach((match) => {
      match.jewelPositions.forEach((jewelPosition) => {
        const jewel = grid.getJewelAtPosition(jewelPosition);
        if (jewel.jewelType === JewelType.Fire)
          this.handleSpecialJewelRemoval(jewelPosition, getExplosionPositions);

        if (jewel.jewelType === JewelType.Lightning)
          this.handleSpecialJewelRemoval(jewelPosition, getZapPositions);
      });
    });

    matches.forEach((match) => {
      if (match.jewelPositions.length === MINIMUM_MATCH_LENGTH) {
        match.jewelPositions.forEach((jewelPosition) => {
          const jewel = grid.getJewelAtPosition(jewelPosition);
          this.animationRegistry.register(jewelPosition);
          this.isComplete = false;
          jewel.fadeoutAnimation = new FadeoutAnimation(jewel, () => {
            this.animationRegistry.unregister(jewelPosition);
            if (this.animationRegistry.isEmpty()) this.isComplete = true;
          });
          jewel.shouldBeReplaced = true;
          this.numJewelsMarkedForRemoval += 1;
        });
      } else if (match.longestAxisLength < 5) {
        this.handleSpecialJewelCreation(
          match,
          JewelType.Fire,
          getFireJewelPosition
        );
      } else {
        this.handleSpecialJewelCreation(
          match,
          JewelType.Lightning,
          getLightningJewelPosition
        );
      }
    });
  }

  handleSpecialJewelCreation(
    match: Match,
    jewelType: JewelType,
    positionGetter: (match: Match) => Point
  ) {
    const newSpecialJewelPosition = positionGetter(match);

    const newSpecialJewel = grid.getJewelAtPosition(newSpecialJewelPosition);
    newSpecialJewel.jewelType = jewelType;
    if (newSpecialJewel.shouldBeReplaced) {
      newSpecialJewel.shouldBeReplaced = false;
      newSpecialJewel.opacity = 1;
      this.numJewelsMarkedForRemoval -= 1;
    }

    match.jewelPositions.forEach((jewelPosition) => {
      const currentJewel = grid.getJewelAtPosition(jewelPosition);
      if (newSpecialJewelPosition.isEqual(jewelPosition))
        return console.log("Special jewel skipped"); // skip the fire jewel

      this.animationRegistry.register(jewelPosition);
      this.isComplete = false;
      currentJewel.coalescingAnimation = new TranslationAnimation(
        cloneDeep(currentJewel.pixelPosition),
        cloneDeep(newSpecialJewel.pixelPosition),
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
  }

  handleSpecialJewelRemoval(
    jewelPosition: Point,
    affectedPositionsGetter: (centerPosition: Point) => Point[]
  ) {
    const jewel = grid.getJewelAtPosition(jewelPosition);
    const specialJewelTypes = [JewelType.Fire, JewelType.Lightning];
    if (specialJewelTypes.includes(jewel.jewelType)) {
      const affectedPositions = affectedPositionsGetter(jewelPosition);

      affectedPositions.forEach((affectedPosition) => {
        if (
          affectedPosition.x < 0 ||
          affectedPosition.x > GRID_CELL_DIMENSIONS.COLUMNS - 1 ||
          affectedPosition.y < 0 ||
          affectedPosition.y > GRID_CELL_DIMENSIONS.ROWS - 1
        )
          return;
        const affectedJewel = grid.getJewelAtPosition(affectedPosition);
        if (affectedJewel.shouldBeReplaced) return;
        if (jewel.jewelType === JewelType.Fire)
          affectedJewel.isExploding = true;
        if (jewel.jewelType === JewelType.Lightning)
          affectedJewel.isBeingZapped = true;
        affectedJewel.shouldBeReplaced = true;
        this.numJewelsMarkedForRemoval += 1;
        affectedJewel.opacity = 0;
        if (affectedJewel.jewelType === JewelType.Fire)
          this.handleSpecialJewelRemoval(
            affectedPosition,
            getExplosionPositions
          );

        if (affectedJewel.jewelType === JewelType.Lightning)
          this.handleSpecialJewelRemoval(affectedPosition, getZapPositions);
      });
    }
  }

  onComplete(): void {
    grid.updateScore(this.numJewelsMarkedForRemoval);

    if (this.numJewelsMarkedForRemoval > 0)
      gameEventManager.addEvent(new ColumnRefillsGameEvent());
  }
}

function getFireJewelPosition(match: Match): Point {
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

function getLightningJewelPosition(match: Match): Point {
  if (match.predeterminedSpecialJewelPositionOption)
    return match.predeterminedSpecialJewelPositionOption;

  const lightningJewelPosition: Point | undefined = match.jewelPositions[2];
  if (lightningJewelPosition === undefined)
    throw new Error("lightning jewel not expected length");
  return lightningJewelPosition;
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

function getZapPositions(center: Point) {
  const positions: Point[] = [];

  for (let rowIndex = 0; rowIndex < GRID_CELL_DIMENSIONS.ROWS; rowIndex += 1) {
    positions.push(new Point(center.x, rowIndex));
  }
  for (
    let columnIndex = 0;
    columnIndex < GRID_CELL_DIMENSIONS.COLUMNS;
    columnIndex += 1
  ) {
    //so the center point does not get added to position list twice
    if (columnIndex === center.x) continue;
    positions.push(new Point(columnIndex, center.y));
  }
  return positions;
}

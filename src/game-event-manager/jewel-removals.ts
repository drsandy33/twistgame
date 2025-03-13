import cloneDeep from "lodash.clonedeep";
import { GameEvent, GameEventType } from ".";
import { Point } from "../types";
import { FadeoutAnimation } from "../jewel/fadeout-animation";
import { JewelType } from "../jewel/jewel-consts";
import { TranslationAnimation } from "../jewel/translation-animation";
import { ColumnRefillsGameEvent } from "./column-refills";
import { Match } from "../match-checker";
import { GRID_CELL_DIMENSIONS, MINIMUM_MATCH_LENGTH } from "../app-consts";
import { getRandomHexColor } from "../utils";
import { TwistGame } from "../game";
import { Grid } from "../grid";
import { useGameStore } from "../stores/game-store";

export class JewelRemovalsGameEvent extends GameEvent {
  numJewelsMarkedForRemoval = 0;
  constructor(game: TwistGame) {
    super(GameEventType.JewelRemovals, game);
  }

  start(): void {
    const { grid, matchChecker } = this.game;
    const matches = matchChecker.checkForMatches();
    grid.markMatchedJewelsAndStopCountingMatchedJewels(matches);

    matches.forEach((match) => {
      const matchColor = getRandomHexColor();
      match.jewelPositions.forEach((jewelPosition) => {
        const jewel = grid.getJewelAtPosition(jewelPosition);
        jewel.matchColorOption = matchColor;

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

          jewel.shouldBeReplaced = true;
          this.numJewelsMarkedForRemoval += 1;

          jewel.animations.push(new FadeoutAnimation(jewel, () => {}));
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
    positionGetter: (grid: Grid, match: Match) => Point
  ) {
    const { grid } = this.game;
    const newSpecialJewelPosition = positionGetter(grid, match);

    const newSpecialJewel = grid.getJewelAtPosition(newSpecialJewelPosition);
    newSpecialJewel.isExploding = false;
    newSpecialJewel.isBeingZapped = false;
    newSpecialJewel.jewelType = jewelType;

    if (newSpecialJewel.shouldBeReplaced) {
      newSpecialJewel.shouldBeReplaced = false;
      newSpecialJewel.opacity = 1;
      this.numJewelsMarkedForRemoval -= 1;
    }

    match.jewelPositions.forEach((jewelPosition) => {
      const currentJewel = grid.getJewelAtPosition(jewelPosition);

      if (newSpecialJewel.id === currentJewel.id)
        return console.log("skipping new special jewel translation");

      currentJewel.shouldBeReplaced = true;
      this.numJewelsMarkedForRemoval += 1;

      currentJewel.animations.push(
        new TranslationAnimation(
          cloneDeep(currentJewel.pixelPosition),
          cloneDeep(newSpecialJewel.pixelPosition),
          currentJewel,
          () => {
            currentJewel.opacity = 0;
          }
        )
      );
    });
  }

  handleSpecialJewelRemoval(
    jewelPosition: Point,
    affectedPositionsGetter: (centerPosition: Point) => Point[]
  ) {
    const { grid } = this.game;
    const jewel = grid.getJewelAtPosition(jewelPosition);
    const specialJewelTypes = [JewelType.Fire, JewelType.Lightning];
    if (specialJewelTypes.includes(jewel.jewelType)) {
      const affectedPositions = affectedPositionsGetter(jewelPosition);

      affectedPositions.forEach((affectedPosition) => {
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
    const { grid, gameEventManager } = this.game;
    grid.updateScore(this.numJewelsMarkedForRemoval);
    useGameStore.getState().mutateState((state) => {
      state.currentLevel = grid.getCurrentLevel();
    });

    this.game.checkForGameOver();
    if (useGameStore.getState().isGameOver) {
      return;
    }

    grid.getAllJewels().forEach((jewel) => {
      jewel.isPartOfMatch = false;
    });
    if (this.numJewelsMarkedForRemoval > 0)
      gameEventManager.addEvent(new ColumnRefillsGameEvent(this.game));
  }
}

function getFireJewelPosition(grid: Grid, match: Match): Point {
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

function getLightningJewelPosition(_grid: Grid, match: Match): Point {
  if (match.predeterminedSpecialJewelPositionOption)
    return match.predeterminedSpecialJewelPositionOption;

  const lightningJewelPosition: Point | undefined = match.jewelPositions[2];
  if (lightningJewelPosition === undefined)
    throw new Error("lightning jewel not expected length");
  return lightningJewelPosition;
}

function getExplosionPositions(center: Point) {
  const positions: Point[] = [];
  const { COLUMNS, ROWS } = GRID_CELL_DIMENSIONS;

  for (let rowIndex = -1; rowIndex < 2; rowIndex += 1) {
    for (let i = -1; i < 2; i += 1) {
      const x = center.x + i;
      const y = center.y + rowIndex;
      if (x < 0 || x > COLUMNS - 1 || y < 0 || y > ROWS - 1) continue;
      positions.push(new Point(x, y));
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

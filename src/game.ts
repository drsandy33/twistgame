import { RENDER_INTERVAL } from "./app-consts";
import { GameEventManager } from "./game-event-manager";
import { Jewel } from "./jewel";
import { JewelAnimation } from "./jewel/animation";
import { Grid } from "./grid";
import { MatchChecker } from "./match-checker";
import { GridRefiller } from "./grid-refiller";
import { SetStateAction } from "react";
import { chooseRandomFromArray, iterateNumericEnum } from "./utils";
import { JewelColor } from "./jewel/jewel-consts";
import { useGameStore } from "./stores/game-store";

export class TwistGame {
  lastRenderTimestamp: number = 0;
  lastAnimationFrameId: number = 0;
  grid = new Grid();
  matchChecker = new MatchChecker(this.grid);
  gridRefiller = new GridRefiller(this.grid);
  gameEventManager = new GameEventManager(this);

  constructor(private context: CanvasRenderingContext2D) {
    this.removeMatchesFromGrid();
  }

  startGameLoop() {
    this.lastAnimationFrameId = requestAnimationFrame((timestamp) => {
      this.tick(timestamp);
    });
  }

  stopGameLoop() {
    cancelAnimationFrame(this.lastAnimationFrameId);
  }

  reset() {
    this.stopGameLoop();
    const { grid } = this;

    useGameStore.getState().mutateState((state) => {
      state.numJewelsRemoved = 0;
    });

    grid.getAllJewels().forEach((jewel) => {
      jewel.opacity = 0;
    });

    grid.rows = grid.makeGrid(
      grid.cellDimensions.height,
      grid.cellDimensions.width
    );
    this.removeMatchesFromGrid();

    useGameStore.getState().mutateState((state) => {
      state.isGameOver = false;
    });
    grid.isGameOver = false;

    this.startGameLoop();
  }

  tick(timestamp: number) {
    this.gameEventManager.process();

    if (timestamp - this.lastRenderTimestamp >= RENDER_INTERVAL)
      this.updateCanvas();

    this.lastAnimationFrameId = requestAnimationFrame((timestamp) => {
      this.tick(timestamp);
    });
  }

  updateCanvas() {
    const jewelsToUpdate: Jewel[] = this.grid.getAllJewels();

    this.gridRefiller.replacements?.forEach((column) => {
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

    this.grid.drawSelf(this.context);

    jewelsToUpdate.forEach((jewel) => {
      jewel.drawSelf(this.context);
    });
  }

  removeMatchesFromGrid() {
    let matches = this.matchChecker.checkForMatches();
    let numAttemptsToRemoveAllMatches = 0;
    const maxAttempts = 10;

    while (matches.length && numAttemptsToRemoveAllMatches < maxAttempts) {
      numAttemptsToRemoveAllMatches += 1;

      for (const match of matches) {
        match.jewelPositions.forEach((jewelPosition, i) => {
          if (i !== 1) return;
          const jewel = this.grid.getJewelAtPosition(jewelPosition);
          if (jewel === undefined) throw new Error("no jewel found");
          const matchColor = jewel.jewelColor;

          const validColors = iterateNumericEnum(JewelColor).filter(
            (jewelColor) =>
              jewelColor !== JewelColor.Rock && jewelColor !== matchColor
          );
          const selectedColor: JewelColor = chooseRandomFromArray(validColors);
          jewel.jewelColor = selectedColor;
        });
      }

      matches = this.matchChecker.checkForMatches();
    }
    if (numAttemptsToRemoveAllMatches === maxAttempts)
      console.warn("failed to remove matches from initial grid");
  }
}

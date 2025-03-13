import cloneDeep from "lodash.clonedeep";
import { GameEvent, GameEventType } from ".";
import { Point } from "../types";
import { TranslationAnimation } from "../jewel/translation-animation";
import { JewelRemovalsGameEvent } from "./jewel-removals";
import { getJewelPixelPosition } from "../grid";
import { TwistGame } from "../game";
import { useGameStore } from "../stores/game-store";

export class ColumnRefillsGameEvent extends GameEvent {
  constructor(game: TwistGame) {
    super(GameEventType.ColumnRefill, game);
  }

  start(): void {
    const { grid, gridRefiller } = this.game;
    const replacements = gridRefiller.createReplacements();

    grid.getColumns().forEach((column, i) => {
      if (replacements.length === 0)
        throw new Error("expected replacements not found");
      const replacementColumn = replacements[i];

      if (replacementColumn === undefined)
        throw new Error("replacement column not found");

      const combinedColumn = replacementColumn.concat(column);

      const unassignedEmptyPositions: {
        pixelPosition: Point;
        cellPosition: Point;
      }[] = [];

      let rowIndex = column.length;

      while (combinedColumn.length > 0) {
        const currentJewel = combinedColumn.pop();
        if (currentJewel === undefined)
          throw new Error("expected jewel not found");

        rowIndex = rowIndex - 1;

        const currentJewelCellPosition = new Point(i, rowIndex);

        const currentJewelPositions = {
          pixelPosition: getJewelPixelPosition(
            currentJewelCellPosition.y,
            currentJewelCellPosition.x
          ),
          cellPosition: cloneDeep(currentJewelCellPosition),
        };

        if (currentJewel.shouldBeReplaced) {
          unassignedEmptyPositions.push(currentJewelPositions);
          continue;
        }

        if (unassignedEmptyPositions.length <= 0) continue;

        const positionToAssign = unassignedEmptyPositions.shift();
        if (!positionToAssign) throw new Error("position to assign not found");

        currentJewel.animations.push(
          new TranslationAnimation(
            cloneDeep(currentJewel.pixelPosition),
            cloneDeep(positionToAssign.pixelPosition),
            currentJewel,
            () => {
              grid.putJewelInPosition(
                cloneDeep(positionToAssign.cellPosition),
                currentJewel
              );
            }
          )
        );

        unassignedEmptyPositions.push(currentJewelPositions);
      }
      console.log("finished ColumnRefill while loop");
    });
  }

  onComplete(): void {
    const { matchChecker, grid, gameEventManager, gridRefiller } = this.game;
    const matches = matchChecker.checkForMatches();

    gridRefiller.replacements = [];

    useGameStore.getState().mutateState((state) => {
      state.numJewels = grid.getAllJewels().length;
    });

    if (matches.length > 0)
      gameEventManager.addEvent(new JewelRemovalsGameEvent(this.game));
  }
}

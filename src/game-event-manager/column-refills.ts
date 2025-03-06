import cloneDeep from "lodash.clonedeep";
import { GameEvent, GameEventType } from ".";
import { AnimationRegistry } from "../animation-registry";
import { gameEventManager, grid, gridRefiller, matchChecker } from "../App";
import { Point } from "../jewel-quartet";
import { TranslationAnimation } from "../jewel/translation-animation";
import { JewelRemovalsGameEvent } from "./jewel-removals";
import { getJewelPixelPosition } from "../grid";

export class ColumnRefillsGameEvent extends GameEvent {
  animationRegistry = new AnimationRegistry();
  constructor() {
    super(GameEventType.ColumnRefill);
  }

  start(): void {
    const replacements = gridRefiller.createReplacements();

    grid.getColumns().forEach((column, i) => {
      if (!replacements) return;
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
        if (currentJewel === undefined) break;

        rowIndex = rowIndex - 1;

        const currentJewelCellPosition = new Point(i, rowIndex);
        const currentJewelPositions = {
          pixelPosition: getJewelPixelPosition(
            currentJewelCellPosition.y,
            currentJewelCellPosition.x
          ),
          cellPosition: currentJewelCellPosition,
        };

        if (currentJewel.shouldBeReplaced) {
          unassignedEmptyPositions.push(currentJewelPositions);
          continue;
        }

        if (unassignedEmptyPositions.length <= 0) continue;

        const positionToAssign = unassignedEmptyPositions.shift();
        if (!positionToAssign) throw new Error("position to assign not found");

        this.animationRegistry.register(currentJewelCellPosition);
        currentJewel.justMoved = true;
        currentJewel.fallingAnimation = new TranslationAnimation(
          cloneDeep(currentJewel.pixelPosition),
          cloneDeep(positionToAssign.pixelPosition),
          currentJewel,
          () => {
            grid.putJewelInPosition(
              positionToAssign.cellPosition,
              currentJewel
            );
            this.animationRegistry.unregister(currentJewelCellPosition);
            if (this.animationRegistry.isEmpty()) this.isComplete = true;
          }
        );

        unassignedEmptyPositions.push(currentJewelPositions);
      }
    });
  }

  onComplete(): void {
    const matches = matchChecker.checkForMatches();
    if (matches.length > 0)
      gameEventManager.addEvent(new JewelRemovalsGameEvent());
  }
}

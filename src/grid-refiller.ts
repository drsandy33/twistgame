import cloneDeep from "lodash.clonedeep";
import { createJewel, getJewelPixelPosition, Grid } from "./grid";
import { Jewel } from "./jewel";
import { Point } from "./jewel-quartet";
import { FallingAnimation } from "./jewel/falling-animation";

export class GridRefiller {
  replacements: null | Jewel[][] = null;
  constructor(private grid: Grid) {}

  getNumToReplaceInColumn(column: Jewel[]) {
    let numToReplace = 0;
    column.forEach((jewel) => {
      if (jewel.isPartOfMatch) numToReplace = numToReplace + 1;
    });
    return numToReplace;
  }

  createReplacementColumn(size: number, columnIndex: number) {
    const replacementColumn: Jewel[] = [];
    for (let i = 0; i < size; i = i + 1) {
      const pixelPosition = getJewelPixelPosition(size * -1 + i, columnIndex);
      const jewel = createJewel(0, pixelPosition);
      replacementColumn.push(jewel);
    }
    return replacementColumn;
  }
  createReplacements() {
    const newReplacements: Jewel[][] = [];
    this.grid.getColumns().forEach((column, i) => {
      const size = this.getNumToReplaceInColumn(column);
      const replacementColumn = this.createReplacementColumn(size, i);
      newReplacements.push(replacementColumn);
    });

    this.replacements = newReplacements;
    this.startFallingAnimation();
  }
  startFallingAnimation() {
    this.grid.getColumns().forEach((column, i) => {
      if (!this.replacements) return;
      const replacementColumn = this.replacements[i];
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
        rowIndex = rowIndex - 1;
        if (currentJewel === undefined) break;
        if (currentJewel.isPartOfMatch)
          unassignedEmptyPositions.push({
            pixelPosition: cloneDeep(currentJewel.pixelPosition),
            cellPosition: new Point(i, rowIndex),
          });
        else if (unassignedEmptyPositions.length > 0) {
          const positionToAssign = unassignedEmptyPositions.shift();
          if (positionToAssign === undefined)
            throw new Error("position to assign not found");
          currentJewel.fallingAnimation = new FallingAnimation(
            cloneDeep(currentJewel.pixelPosition),
            positionToAssign.pixelPosition,
            currentJewel,
            () => {
              this.grid.putJewelInPosition(
                positionToAssign.cellPosition,
                currentJewel
              );
            }
          );

          unassignedEmptyPositions.push({
            pixelPosition: cloneDeep(currentJewel.pixelPosition),
            cellPosition: new Point(i, rowIndex),
          });
        }
      }
    });
  }
}

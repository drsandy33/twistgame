import { createJewel, getJewelPixelPosition, Grid } from "./grid";
import { Jewel } from "./jewel";
// import { queueGridEvaluation } from "./evaluate-and-update-grid";

export class GridRefiller {
  replacements: null | Jewel[][] = null;
  constructor(private grid: Grid) {}

  getNumToReplaceInColumn(column: Jewel[]) {
    let numToReplace = 0;
    column.forEach((jewel) => {
      if (jewel.shouldBeReplaced) numToReplace = numToReplace + 1;
    });
    return numToReplace;
  }

  createReplacementColumn(size: number, columnIndex: number) {
    const replacementColumn: Jewel[] = [];
    for (let i = 0; i < size; i = i + 1) {
      const pixelPosition = getJewelPixelPosition(size * -1 + i, columnIndex);
      const jewel = createJewel(this.grid.getCurrentLevel(), pixelPosition);
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

    return newReplacements;
  }
}

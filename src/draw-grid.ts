import { GRID_PIXEL_DIMENSIONS, GRID_SIZE } from "./app-consts";
import { getJewelPosition } from "./game";
import { Jewel } from "./jewel";

export function drawGrid(grid: Jewel[][], context: CanvasRenderingContext2D) {
  context.clearRect(
    0,
    0,
    GRID_PIXEL_DIMENSIONS.WIDTH,
    GRID_PIXEL_DIMENSIONS.HEIGHT
  );
  for (let i = 0; i < grid.length; i = i + 1) {
    const row = grid[i];
    if (row === undefined) throw new Error("expected does not exist");
    for (let j = 0; j < row.length; j = j + 1) {
      const jewel = row[j];
      if (jewel === undefined) throw new Error("expected jewel does not exist");
      const jewelPlace = getJewelPosition(
        i,
        j,
        GRID_PIXEL_DIMENSIONS.HEIGHT,
        GRID_PIXEL_DIMENSIONS.WIDTH,
        GRID_SIZE.ROWS,
        GRID_SIZE.COLUMNS
      );
      jewel.drawSelf(context, jewelPlace);
    }
  }
}

import { JewelType } from "./jewel/jewel-consts";
export const GRID_PIXEL_DIMENSIONS = { WIDTH: 500, HEIGHT: 500 };
export const GRID_CELL_DIMENSIONS = { ROWS: 8, COLUMNS: 8 };
export const SELECT_GRID_SIZE = {
  ROWS: GRID_CELL_DIMENSIONS.ROWS - 1,
  COLUMNS: GRID_CELL_DIMENSIONS.COLUMNS - 1,
};
export const JEWEL_DIAMETER =
  GRID_PIXEL_DIMENSIONS.HEIGHT / GRID_CELL_DIMENSIONS.ROWS;
export const FPS = 30;
export const RENDER_INTERVAL = 1000 / FPS;
export const ROTATION_ANIMATION_DURATION = 150;
export const FADEOUT_ANIMATION_DURATION = 250;
export const SPECIAL_JEWEL_PULSING_ANIMATION_DURATION = 2000;
export const FALLING_ANIMATION_DURATION = 700;
export const MINIMUM_MATCH_LENGTH = 3;
export const COUNTING_JEWEL_BASE_START_COUNT = 20;
export const JEWEL_TYPE_CHANCES_BY_LEVEL: Record<JewelType, number> = {
  [JewelType.Normal]: 0,
  [JewelType.Fire]: 0,
  [JewelType.Lightning]: 0,
  [JewelType.Counting]: 0.007,

  [JewelType.Rock]: 0.01,

  [JewelType.Locked]: 0,
  [JewelType.MarkedLocked]: 0.005,
  //[JewelType.MarkedLocked]: 0.4,
};

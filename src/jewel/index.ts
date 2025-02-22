import {
  GRID_PIXEL_DIMENSIONS,
  GRID_SIZE,
  JEWEL_DIAMETER,
} from "../app-consts";

export enum JewelType {
  Normal,
  Fire,
  Lightening,
  Counting,
  Rock,
  Locked,
  Markedlocked,
}
export enum JewelColor {
  Red,
  Blue,
  White,
  Rock,
  Purple,
  Green,
  Yellow,
}
const JEWEL_COLOR_STRINGS: Record<JewelColor, string> = {
  [JewelColor.Red]: "#BE252A",
  [JewelColor.Blue]: "#2565BE",
  [JewelColor.White]: "#FBF3F3",
  [JewelColor.Rock]: "#020101",
  [JewelColor.Purple]: "#BF40BF",
  [JewelColor.Green]: "#29A832",
  [JewelColor.Yellow]: "#E0D736",
};
export class Jewel {
  jewelColor: JewelColor;
  jewelType: JewelType;
  count: number;
  constructor(jewelColor: JewelColor, jewelType: JewelType, count: number) {
    this.jewelColor = jewelColor;
    this.jewelType = jewelType;
    this.count = count;
  }
  drawSelf(context: CanvasRenderingContext2D, place: { x: number; y: number }) {
    context.beginPath();
    context.arc(place.x, place.y, JEWEL_DIAMETER / 2, 0, 2 * Math.PI);
    context.fillStyle = JEWEL_COLOR_STRINGS[this.jewelColor];
    context.fill();
  }
}

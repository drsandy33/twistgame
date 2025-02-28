import { JEWEL_DIAMETER } from "../app-consts";
import { Point } from "../jewel-quartet";
import { hexToRgba } from "../utils";
import { FadeoutAnimation } from "./fadeout-animation";
import { RotationAnimation } from "./rotation-animation";

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
  isSelected: boolean = false;
  isPartOfMatch: boolean = false;
  rotationAnimation: null | RotationAnimation = null;
  fadeoutAnimation: null | FadeoutAnimation = null;
  opacity: number = 1;
  constructor(
    jewelColor: JewelColor,
    jewelType: JewelType,
    count: number,
    public pixelPosition: Point
  ) {
    this.jewelColor = jewelColor;
    this.jewelType = jewelType;
    this.count = count;
  }
  drawSelf(context: CanvasRenderingContext2D) {
    const { x, y } = this.pixelPosition;
    context.beginPath();
    context.arc(x, y, JEWEL_DIAMETER / 2, 0, 2 * Math.PI);
    const colorRgba = hexToRgba(JEWEL_COLOR_STRINGS[this.jewelColor], 1);
    context.fillStyle = colorRgba;
    context.fill();
    if (this.isPartOfMatch) {
      context.beginPath();
      context.arc(x, y, JEWEL_DIAMETER / 3, 0, 2 * Math.PI);
      context.strokeStyle = "cyan";
      context.lineWidth = 10;
      context.stroke();
    }

    if (this.isSelected === false) return;
    context.beginPath();
    context.arc(x, y, JEWEL_DIAMETER / 2, 0, 2 * Math.PI);
    context.strokeStyle = "white";
    context.lineWidth = 10;
    context.stroke();
  }
}

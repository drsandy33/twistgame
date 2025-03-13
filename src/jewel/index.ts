import { Point } from "../types";
import { JewelColor, JewelType } from "./jewel-consts";
import { drawSelf } from "./draw-self";
import { JewelAnimation } from "./animation";

let nextJewelId = 0;

export class Jewel {
  jewelColor: JewelColor;
  jewelType: JewelType;
  count: number;
  isSelected: boolean = false;
  isPartOfMatch: boolean = false;
  shouldBeReplaced: boolean = false;
  isExploding: boolean = false;
  isBeingZapped: boolean = false;
  justMoved: boolean = false;
  animations: JewelAnimation[] = [];
  opacity: number = 1;
  id: number = nextJewelId++;
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
  drawSelf = drawSelf;
}

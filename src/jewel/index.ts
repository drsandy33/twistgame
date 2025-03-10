import { imageManager } from "../App";
import { JEWEL_DIAMETER } from "../app-consts";
import { Point } from "../jewel-quartet";

import { FadeoutAnimation } from "./fadeout-animation";
import { TranslationAnimation } from "./translation-animation";
import {
  JewelColor,
  JewelType,
  JEWEL_COLOR_URLS,
  JEWEL_TYPE_INDICATOR_URLS,
} from "./jewel-consts";
import { RotationAnimation } from "./rotation-animation";

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
  rotationAnimation: null | RotationAnimation = null;
  fadeoutAnimation: null | FadeoutAnimation = null;
  fallingAnimation: null | TranslationAnimation = null;
  coalescingAnimation: null | TranslationAnimation = null;
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
    // context.beginPath();
    // context.arc(x, y, JEWEL_DIAMETER / 2, 0, 2 * Math.PI);
    // const colorRgba = hexToRgba(JEWEL_COLOR_STRINGS[this.jewelColor], 1);
    // context.fillStyle = colorRgba;
    // context.fill();
    const imagePath = JEWEL_COLOR_URLS[this.jewelColor];
    const image = imageManager.cachedImages[imagePath];
    if (image instanceof Image) {
      const aspectRatio = image.width / image.height;
      const desiredHeight = JEWEL_DIAMETER;
      const desiredWidth = JEWEL_DIAMETER * aspectRatio;
      context.globalAlpha = this.opacity;
      context.drawImage(
        image,
        x - desiredWidth / 2,
        y - desiredHeight / 2,
        desiredWidth,
        desiredHeight
      );
      if (
        this.jewelType === JewelType.Fire ||
        this.jewelType === JewelType.MarkedLocked ||
        this.jewelType === JewelType.Locked ||
        this.jewelType === JewelType.Lightning
      ) {
        const imagePath = JEWEL_TYPE_INDICATOR_URLS[this.jewelType];
        if (imagePath === undefined)
          throw new Error("fire indicator image path not found");
        const image = imageManager.cachedImages[imagePath];
        if (!(image instanceof Image))
          throw new Error("special jewel indicator image not found");
        const aspectRatio = image.width / image.height;
        const desiredHeight = JEWEL_DIAMETER / 2;
        const desiredWidth = desiredHeight * aspectRatio;
        context.beginPath();
        context.arc(x, y, JEWEL_DIAMETER / 4, 0, Math.PI * 2);
        context.fillStyle = "black";
        context.fill();
        context.drawImage(
          image,
          x - desiredWidth / 2,
          y - desiredHeight / 2,
          desiredWidth,
          desiredHeight
        );
      }
      context.globalAlpha = 1;
    }

    if (this.jewelType === JewelType.Counting) {
      context.beginPath();
      context.arc(x, y, JEWEL_DIAMETER / 4, 0, Math.PI * 2);
      context.fillStyle = `rgba(0,0,0,${this.opacity})`;
      context.fill();
      context.fillStyle = `rgba(255,255,255,${this.opacity})`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "20px sans";
      context.fillText(
        this.count.toString(),
        this.pixelPosition.x,
        this.pixelPosition.y
      );
    }
    if (this.isExploding) {
      context.beginPath();
      context.arc(x, y, JEWEL_DIAMETER / 3, 0, 2 * Math.PI);
      context.strokeStyle = "orange";
      context.lineWidth = 5;
      context.stroke();
    }
    if (this.isBeingZapped) {
      context.beginPath();
      context.arc(x, y, JEWEL_DIAMETER / 3, 0, 2 * Math.PI);
      context.strokeStyle = "dodgerblue";
      context.lineWidth = 5;
      context.stroke();
    }

    if (this.isSelected === false) return;
    context.beginPath();
    context.arc(x, y, JEWEL_DIAMETER / 2, 0, 2 * Math.PI);
    context.strokeStyle = "white";
    context.lineWidth = 5;
    context.stroke();
  }
}

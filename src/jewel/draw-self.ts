import { Jewel } from ".";
import { imageManager } from "../App";
import { JEWEL_DIAMETER } from "../app-consts";
import { Point } from "../types";
import { hexToRgba } from "../utils";
import {
  JEWEL_COLOR_URLS,
  JEWEL_TYPE_INDICATOR_URLS,
  JEWEL_TYPE_STRINGS,
  JewelColor,
  JewelType,
} from "./jewel-consts";

export function drawSelf(this: Jewel, context: CanvasRenderingContext2D) {
  const animatedSymbolScaling = getPulsingAnimationScaledValue(this.jewelType);
  drawJewelImage(context, this);
  drawSpecialJewelSymbol(context, this, animatedSymbolScaling);
  context.globalAlpha = 1;
  drawJewelCount(context, this, animatedSymbolScaling);
  if (this.isExploding) drawExplosionEffect(context, this.pixelPosition);
  if (this.isBeingZapped) drawZapEffect(context, this.pixelPosition);
  // FOR TESTING
  drawJewelIdTag(context, this);
  drawJewelDebugText(context, this);
}

function getPulsingAnimationScaledValue(jewelType: JewelType) {
  const time = Date.now() * 0.002;
  let scalingFactor = 1;
  if (jewelType === JewelType.Counting || jewelType === JewelType.MarkedLocked)
    scalingFactor = (Math.sin(time) + 1) / 2;
  return 0.75 + scalingFactor * 0.2;
}

function drawJewelImage(context: CanvasRenderingContext2D, jewel: Jewel) {
  const { x, y } = jewel.pixelPosition;
  const imagePath = JEWEL_COLOR_URLS[jewel.jewelColor];
  const image = imageManager.cachedImages[imagePath];

  if (image instanceof Image) {
    const aspectRatio = image.width / image.height;
    const desiredHeight = JEWEL_DIAMETER;
    const desiredWidth = JEWEL_DIAMETER * aspectRatio;
    context.globalAlpha = jewel.opacity;
    context.drawImage(
      image,
      x - desiredWidth / 2,
      y - desiredHeight / 2,
      desiredWidth,
      desiredHeight
    );
  }
}

function drawSpecialJewelSymbol(
  context: CanvasRenderingContext2D,
  jewel: Jewel,
  animatedSymbolScaling: number
) {
  const specialJewelsTypesWithSymbols = [
    JewelType.Fire,
    JewelType.MarkedLocked,
    JewelType.Locked,
    JewelType.Lightning,
  ];

  if (!specialJewelsTypesWithSymbols.includes(jewel.jewelType)) return;

  const { x, y } = jewel.pixelPosition;

  const imagePath = JEWEL_TYPE_INDICATOR_URLS[jewel.jewelType];
  if (imagePath === undefined)
    throw new Error("fire indicator image path not found");
  const image = imageManager.cachedImages[imagePath];
  if (!(image instanceof Image))
    throw new Error("special jewel indicator image not found");
  const aspectRatio = image.width / image.height;

  const desiredHeight = (JEWEL_DIAMETER / 2) * animatedSymbolScaling;
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

function drawJewelCount(
  context: CanvasRenderingContext2D,
  jewel: Jewel,
  animatedSymbolScaling: number
) {
  if (jewel.jewelType !== JewelType.Counting) return;

  const { x, y } = jewel.pixelPosition;
  context.beginPath();
  context.arc(x, y, JEWEL_DIAMETER / 4, 0, Math.PI * 2);
  context.fillStyle = `rgba(0,0,0,${jewel.opacity})`;
  context.fill();
  context.fillStyle = `rgba(255,255,255,${jewel.opacity})`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const fontSize = 20 * animatedSymbolScaling;
  context.font = `${fontSize}px sans`;
  context.fillText(
    jewel.count.toString(),
    jewel.pixelPosition.x,
    jewel.pixelPosition.y
  );
}

function drawExplosionEffect(context: CanvasRenderingContext2D, center: Point) {
  const { x, y } = center;
  context.beginPath();
  context.arc(x, y, JEWEL_DIAMETER / 3, 0, 2 * Math.PI);
  context.strokeStyle = "orange";
  context.lineWidth = 5;
  context.stroke();
}

function drawZapEffect(context: CanvasRenderingContext2D, center: Point) {
  const { x, y } = center;
  context.beginPath();
  context.arc(x, y, JEWEL_DIAMETER / 3, 0, 2 * Math.PI);
  context.strokeStyle = "dodgerblue";
  context.lineWidth = 5;
  context.stroke();
}

function drawJewelColorCircle(
  context: CanvasRenderingContext2D,
  center: Point,
  color: JewelColor
) {
  const { x, y } = center;
  context.beginPath();
  context.arc(x, y, JEWEL_DIAMETER / 2, 0, 2 * Math.PI);
  const colorRgba = hexToRgba(JEWEL_COLOR_URLS[color], 1);
  context.fillStyle = colorRgba;
  context.fill();
}

function drawSelectionCircle(context: CanvasRenderingContext2D, jewel: Jewel) {
  if (jewel.isSelected === false) return;
  const { x, y } = jewel.pixelPosition;
  context.beginPath();
  context.arc(x, y, JEWEL_DIAMETER / 2, 0, 2 * Math.PI);
  context.strokeStyle = "white";
  context.lineWidth = 5;
  context.stroke();
}

function drawJewelIdTag(context: CanvasRenderingContext2D, jewel: Jewel) {
  const { x, y } = jewel.pixelPosition;
  context.beginPath();

  const idTagPosition = new Point(
    x + JEWEL_DIAMETER / 4,
    y + JEWEL_DIAMETER / 4
  );

  const { x: idX, y: idY } = idTagPosition;
  context.arc(idX, idY, JEWEL_DIAMETER / 8, 0, Math.PI * 2);
  context.fillStyle = `rgba(0,0,0,1)`;
  context.fill();
  context.fillStyle = `rgba(255,255,255,1)`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const fontSize = 10;
  context.font = `${fontSize}px sans`;
  context.fillText(jewel.id.toString(), idTagPosition.x, idTagPosition.y);
}

function drawJewelDebugText(context: CanvasRenderingContext2D, jewel: Jewel) {
  const { x, y } = jewel.pixelPosition;
  context.fillStyle = `rgba(255,255,255,1)`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const fontSize = 10;
  context.font = `${fontSize}px sans`;
  context.fillText(JEWEL_TYPE_STRINGS[jewel.jewelType], x, y);
}

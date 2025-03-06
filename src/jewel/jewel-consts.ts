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
  // Rock,
  Purple,
  Green,
  // Yellow,
  // Orange,
}
// const JEWEL_COLOR_STRINGS: Record<JewelColor, string> = {
//   [JewelColor.Red]: "#BE252A",
//   [JewelColor.Blue]: "#2565BE",
//   [JewelColor.White]: "#FBF3F3",
//   [JewelColor.Rock]: "#020101",
//   [JewelColor.Purple]: "#BF40BF",
//   [JewelColor.Green]: "#29A832",
//   [JewelColor.Yellow]: "#E0D736",
//   [JewelColor.Orange]: "",
// };
export const JEWEL_COLOR_URLS: Record<JewelColor, string> = {
  [JewelColor.Red]: "/animals/red.svg",
  [JewelColor.Blue]: "/animals/blue.svg",
  [JewelColor.White]: "/animals/white.svg",
  // [JewelColor.Rock]: "/animals/rock.svg",
  [JewelColor.Purple]: "/animals/purple.svg",
  [JewelColor.Green]: "/animals/green.svg",
  // [JewelColor.Yellow]: "/animals/yellow.svg",
  // [JewelColor.Orange]: "/animals/orange.svg",
};
export const JEWEL_TYPE_INDICATOR_URLS: Partial<Record<JewelType, string>> = {
  [JewelType.Fire]: "/jewel-type-indicator/fire.svg",
};

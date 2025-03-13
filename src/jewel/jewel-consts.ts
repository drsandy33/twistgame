export enum JewelType {
  Normal,
  Fire,
  Lightning,
  Counting,
  Rock,
  Locked,
  MarkedLocked,
}
export enum JewelColor {
  Red,
  Blue,
  White,
  Purple,
  Green,
  Yellow,
  Orange,
  Rock,
}

export const JEWEL_COLOR_URLS: Record<JewelColor, string> = {
  [JewelColor.Red]: "/animals/red.svg",
  [JewelColor.Blue]: "/animals/blue.svg",
  [JewelColor.White]: "/animals/white.svg",
  [JewelColor.Purple]: "/animals/purple.svg",
  [JewelColor.Green]: "/animals/green.svg",
  [JewelColor.Yellow]: "/animals/yellow.svg",
  [JewelColor.Orange]: "/animals/orange.svg",
  [JewelColor.Rock]: "/animals/rock.svg",
};
export const JEWEL_TYPE_INDICATOR_URLS: Partial<Record<JewelType, string>> = {
  [JewelType.Fire]: "/jewel-type-indicator/fire.svg",
  [JewelType.Lightning]: "/jewel-type-indicator/lightning.svg",
  [JewelType.MarkedLocked]: "/jewel-type-indicator/openlock.svg",
  [JewelType.Locked]: "/jewel-type-indicator/closedlock.svg",
};

export const JEWEL_TYPE_STRINGS: Record<JewelType, string> = {
  [JewelType.Normal]: "Normal",
  [JewelType.Fire]: "Fire",
  [JewelType.Lightning]: "Lightning",
  [JewelType.Counting]: "Counting",
  [JewelType.Rock]: "Rock",
  [JewelType.Locked]: "Locked",
  [JewelType.MarkedLocked]: "MarkedLocked",
};

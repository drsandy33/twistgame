import { Point, Radians } from "./types";

export function removeFromArray<T>(array: T[], item: T): undefined | T {
  const indexToRemove = array.indexOf(item);
  if (indexToRemove !== -1) {
    return array.splice(indexToRemove, 1)[0];
  }
}

export function iterateNumericEnum<
  T extends { [name: string]: string | number },
>(enumType: T): T[keyof T][] {
  return Object.values(enumType).filter(
    (value) => !isNaN(Number(value))
  ) as T[keyof T][];
}

export function iterateNumericEnumKeyedRecord<T extends string | number, U>(
  record: Partial<Record<T, U>>
): [T, U][] {
  return Object.entries(record)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => [parseInt(key) as T, value as U]);
}

export function randomNormal() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randomNormal(); // resample between 0 and 1
  return num;
}

/** random number between two given numbers, inclusive */
export function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function chooseRandomFromArray<T>(arr: T[]): T {
  if (arr.length < 1) throw new Error("Array is empty");
  const randomIndex = randBetween(0, arr.length - 1);
  const randomMember = arr[randomIndex];
  if (randomMember === undefined)
    throw new Error("Somehow randomly chose undefined from array");
  return randomMember;
}

export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const toSwap = array[j]!;
    array[j] = array[i]!;
    array[i] = toSwap;
  }
  return array;
}

export function stringIsValidNumber(str: string) {
  return !isNaN(parseInt(str)) && str.trim() !== "";
}

export class SequentialIdGenerator {
  private nextId: number = 0;
  constructor() {}
  getNextId() {
    return String(this.nextId++);
  }
  getNextIdNumeric() {
    return this.nextId++;
  }
}
export function pythagorean(a: number, b: number): number {
  return Math.sqrt(a * a + b * b);
}

export function lerpAngle(start: number, end: number, t: number) {
  const twoPi = Math.PI * 2;
  let delta = (end - start) % twoPi; // Calculate the difference
  if (delta > Math.PI) delta -= twoPi; // Wrap around if necessary
  if (delta < -Math.PI) delta += twoPi; // Wrap around if necessary
  return start + delta * t; // Interpolate
}

export function getOrbitPosition(center: Point, radius: number, angle: number) {
  const x = center.x + radius * Math.cos(angle);
  const y = center.y + radius * Math.sin(angle);
  return new Point(x, y);
}

export function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
export function findHypoteneuseCenterPoint(
  a: number,
  b: number,
  topLeftPosition: Point
) {
  const halfHypoteneuse = pythagorean(a, b) / 2;
  return new Point(
    topLeftPosition.x + halfHypoteneuse,
    topLeftPosition.y + halfHypoteneuse
  );
}

export function indexIsEndOfList<T>(index: number, list: T[]) {
  return index === list.length - 1;
}

export function calculateAngle(center: Point, point: Point): Radians {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const angle = Math.atan2(dy, dx);
  return angle;
}
export function calculateCenter(points: Point[]): Point {
  if (points.length === 0) {
    throw new Error("No points provided");
  }

  let sumX = 0;
  let sumY = 0;

  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }

  const centerX = sumX / points.length;
  const centerY = sumY / points.length;

  return { x: centerX, y: centerY };
}
export function lerp(start: number, end: number, ratio: number): number {
  return start + (end - start) * ratio;
}
export function hexToRgba(hex: string, alpha: number) {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse the r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Return the rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type Milliseconds = number;
export type Radians = number;

export class Point {
  constructor(
    public x: number,
    public y: number
  ) {}
  isEqual(other: Point) {
    return other.x === this.x && other.y === this.y;
  }
}

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
  distance(other: Point) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

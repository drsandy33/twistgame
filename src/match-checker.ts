import { Grid } from "./grid";
import { JewelColor } from "./jewel";
import { Point } from "./jewel-quartet";

export class MatchChecker {
  constructor(private grid: Grid) {}
  checkForMatches() {
    const matches: Point[][] = [];
    let currentMatchCandidate: {
      jewelColor: null | JewelColor;
      jewelPositions: Point[];
    } = { jewelColor: null, jewelPositions: [] };

    this.grid.rows.forEach((row, y) => {
      currentMatchCandidate = {
        jewelColor: null,
        jewelPositions: [],
      };
      row.forEach((jewel, x) => {
        if (currentMatchCandidate.jewelColor === null) {
          currentMatchCandidate.jewelColor = jewel.jewelColor;
        }
        if (currentMatchCandidate.jewelColor === jewel.jewelColor) {
          currentMatchCandidate.jewelPositions.push(new Point(x, y));
        } else {
          if (currentMatchCandidate.jewelPositions.length > 2) {
            matches.push(currentMatchCandidate.jewelPositions);
          }
          currentMatchCandidate = {
            jewelColor: jewel.jewelColor,
            jewelPositions: [new Point(x, y)],
          };
          //start next candidate
        }
      });
    });
    console.log(matches);
  }
}

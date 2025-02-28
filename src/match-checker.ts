import { Grid } from "./grid";
import { Jewel, JewelColor } from "./jewel";
import { Point } from "./jewel-quartet";
import { FadeoutAnimation } from "./jewel/fadeout-animation";

enum Axis {
  Row,
  Column,
}

export class MatchChecker {
  constructor(private grid: Grid) {}
  checkForMatches() {
    const jewels = this.grid.getAllJewels();
    jewels.forEach((jewel) => {
      jewel.isPartOfMatch = false;
    });

    const rowMatches = this.checkAxisForMatches(this.grid.rows, Axis.Row);

    const columns = this.grid.getColumns();
    const columnMatches = this.checkAxisForMatches(columns, Axis.Column);
    const matches: Point[][] = [...rowMatches, ...columnMatches];
    matches.forEach((match) => {
      match.forEach((jewelPosition) => {
        const jewel = this.grid.getJewelAtPosition(jewelPosition);
        jewel.isPartOfMatch = true;
        jewel.fadeoutAnimation = new FadeoutAnimation(jewel, () => {});
      });
    });
  }
  checkAxisForMatches(axis: Jewel[][], axisType: Axis) {
    const matches: Point[][] = [];
    let currentMatchCandidate: {
      jewelColor: null | JewelColor;
      jewelPositions: Point[];
    } = { jewelColor: null, jewelPositions: [] };

    axis.forEach((list, listIndex) => {
      currentMatchCandidate = {
        jewelColor: null,
        jewelPositions: [],
      };
      list.forEach((jewel, jewelIndex) => {
        const x = axisType === Axis.Column ? listIndex : jewelIndex;
        const y = axisType === Axis.Row ? listIndex : jewelIndex;
        const position = new Point(x, y);

        if (currentMatchCandidate.jewelColor === null) {
          currentMatchCandidate.jewelColor = jewel.jewelColor;
        }
        if (currentMatchCandidate.jewelColor === jewel.jewelColor) {
          currentMatchCandidate.jewelPositions.push(position);
        } else {
          if (currentMatchCandidate.jewelPositions.length > 2) {
            matches.push(currentMatchCandidate.jewelPositions);
          }
          currentMatchCandidate = {
            jewelColor: jewel.jewelColor,
            jewelPositions: [position],
          };
        }
      });
    });
    return matches;
  }
}

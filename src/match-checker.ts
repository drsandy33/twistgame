import cloneDeep from "lodash.clonedeep";
import { MINIMUM_MATCH_LENGTH } from "./app-consts";
import { Grid } from "./grid";
import { Jewel } from "./jewel";
import { Point } from "./jewel-quartet";
import { JewelColor } from "./jewel/jewel-consts";

enum Axis {
  Row,
  Column,
}

export class Match {
  longestAxisLength: number = MINIMUM_MATCH_LENGTH;
  predeterminedSpecialJewelPositionOption: Point | null = null;
  constructor(public jewelPositions: Point[]) {
    this.longestAxisLength = jewelPositions.length;
  }
  addIntersectingAxisPositions(positions: Point[]) {
    const axisLength = positions.length + 1;
    if (axisLength > this.longestAxisLength)
      this.longestAxisLength = axisLength;
    this.jewelPositions.push(...positions);
  }
}

class MatchCandidate {
  jewelColor: null | JewelColor = null;
  jewelPositions: Point[] = [];
  constructor(initialPoint?: Point, initialColor?: JewelColor) {
    if (initialPoint) this.jewelPositions.push(initialPoint);
    if (initialColor !== undefined) this.jewelColor = initialColor;
  }
  isMatch() {
    return this.jewelPositions.length >= MINIMUM_MATCH_LENGTH;
  }
}

export class MatchChecker {
  constructor(private grid: Grid) {}
  checkForMatches() {
    this.grid.getAllJewels().forEach((jewel) => {
      jewel.isPartOfMatch = false;
    });
    const rowMatches = this.checkAxisForMatches(this.grid.rows, Axis.Row);
    this.addIntersectingJewelPositionsToRowMatch(rowMatches);

    rowMatches.forEach((match) => {
      match.jewelPositions.forEach((jewelPosition) => {
        const jewel = this.grid.getJewelAtPosition(jewelPosition);
        jewel.isPartOfMatch = true;
      });
    });
    const columns = this.grid.getColumns();
    const columnMatches = this.checkAxisForMatches(columns, Axis.Column);
    const matches: Match[] = [...rowMatches, ...columnMatches];
    matches.forEach((match) => {
      match.jewelPositions.forEach((jewelPosition) => {
        const jewel = this.grid.getJewelAtPosition(jewelPosition);
        jewel.isPartOfMatch = true;
      });
    });
    return matches;
  }
  checkAxisForMatches(axis: Jewel[][], axisType: Axis) {
    const matches: Match[] = [];
    let currentMatchCandidate = new MatchCandidate();

    axis.forEach((list, listIndex) => {
      currentMatchCandidate = new MatchCandidate();
      list.forEach((jewel, jewelIndex) => {
        const x = axisType === Axis.Column ? listIndex : jewelIndex;
        const y = axisType === Axis.Row ? listIndex : jewelIndex;
        const position = new Point(x, y);

        if (currentMatchCandidate.jewelColor === null) {
          currentMatchCandidate.jewelColor = jewel.jewelColor;
        }
        if (
          currentMatchCandidate.jewelColor === jewel.jewelColor &&
          !jewel.isPartOfMatch
        ) {
          currentMatchCandidate.jewelPositions.push(position);

          if (
            jewelIndex === list.length - 1 &&
            currentMatchCandidate.isMatch()
          ) {
            matches.push(new Match(currentMatchCandidate.jewelPositions));
            currentMatchCandidate = new MatchCandidate();
          }
        } else {
          if (currentMatchCandidate.isMatch()) {
            matches.push(new Match(currentMatchCandidate.jewelPositions));
          }
          currentMatchCandidate = new MatchCandidate(
            position,
            jewel.jewelColor
          );
        }
      });
    });
    return matches;
  }

  addIntersectingJewelPositionsToRowMatch(matches: Match[]) {
    matches.forEach((match) => {
      match.jewelPositions.forEach((jewelCellPosition) => {
        const currentJewel = this.grid.getJewelAtPosition(jewelCellPosition);
        const matchedJewelsAbove =
          this.getIntersectingMatchedJewelPositionsInDirection(
            currentJewel,
            jewelCellPosition,
            -1
          );
        const matchedJewelsBelow =
          this.getIntersectingMatchedJewelPositionsInDirection(
            currentJewel,
            jewelCellPosition,
            1
          );
        const intersectingMatchedJewels = [
          ...matchedJewelsAbove,
          ...matchedJewelsBelow,
        ];
        if (intersectingMatchedJewels.length + 1 >= MINIMUM_MATCH_LENGTH) {
          match.addIntersectingAxisPositions(intersectingMatchedJewels);
          match.predeterminedSpecialJewelPositionOption =
            cloneDeep(jewelCellPosition);
        }
      });
    });
  }
  getIntersectingMatchedJewelPositionsInDirection(
    currentJewel: Jewel,
    jewelCellPosition: Point,
    direction: number
  ) {
    const intersectingMatchedJewelPositions: Point[] = [];
    let doneChecking = false;
    let currentIndex = direction;
    while (!doneChecking) {
      try {
        const positionToCheck = new Point(
          jewelCellPosition.x,
          jewelCellPosition.y + currentIndex
        );
        const jewelToCheck = this.grid.getJewelAtPosition(positionToCheck);
        if (jewelToCheck.jewelColor === currentJewel.jewelColor)
          intersectingMatchedJewelPositions.push(positionToCheck);
        else doneChecking = true;
      } catch (error) {
        doneChecking = true;
      }
      currentIndex += direction;
    }
    return intersectingMatchedJewelPositions;
  }
}

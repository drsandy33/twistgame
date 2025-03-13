import cloneDeep from "lodash.clonedeep";
import { GRID_CELL_DIMENSIONS, MINIMUM_MATCH_LENGTH } from "./app-consts";
import { Grid } from "./grid";
import { Jewel } from "./jewel";
import { Point } from "./types";
import { JewelColor, JewelType } from "./jewel/jewel-consts";
import { indexIsEndOfList } from "./utils";

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
    let matchCandidate = new MatchCandidate();

    axis.forEach((list, listIndex) => {
      matchCandidate = new MatchCandidate();
      list.forEach((jewel, jewelIndex) => {
        const x = axisType === Axis.Column ? listIndex : jewelIndex;
        const y = axisType === Axis.Row ? listIndex : jewelIndex;
        const position = new Point(x, y);
        const { jewelType, jewelColor, isPartOfMatch } = jewel;

        if (matchCandidate.jewelColor === null && jewelType !== JewelType.Rock)
          matchCandidate.jewelColor = jewelColor;

        if (matchCandidate.jewelColor === jewel.jewelColor && !isPartOfMatch) {
          matchCandidate.jewelPositions.push(position);

          if (indexIsEndOfList(jewelIndex, list) && matchCandidate.isMatch()) {
            matches.push(new Match(matchCandidate.jewelPositions));
            matchCandidate = new MatchCandidate();
          }
        } else {
          if (matchCandidate.isMatch())
            matches.push(new Match(matchCandidate.jewelPositions));

          if (jewelType !== JewelType.Rock)
            matchCandidate = new MatchCandidate(position, jewel.jewelColor);
          else matchCandidate = new MatchCandidate();
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
      const rowIndex = jewelCellPosition.y + currentIndex;
      if (rowIndex < 0 || rowIndex === GRID_CELL_DIMENSIONS.ROWS) break;

      const positionToCheck = new Point(
        jewelCellPosition.x,
        jewelCellPosition.y + currentIndex
      );

      const jewelToCheck = this.grid.getJewelAtPosition(positionToCheck);

      if (
        jewelToCheck.isPartOfMatch ||
        jewelToCheck.jewelColor !== currentJewel.jewelColor
      ) {
        doneChecking = true;
        break;
      }

      jewelToCheck.isPartOfMatch = true;
      intersectingMatchedJewelPositions.push(positionToCheck);

      currentIndex += direction;
    }
    return intersectingMatchedJewelPositions;
  }
}

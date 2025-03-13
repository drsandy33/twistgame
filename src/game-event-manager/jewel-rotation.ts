import { GameEvent, GameEventType } from ".";
import { TwistGame } from "../game";
import { getJewelPixelPosition } from "../grid";
import { Jewel } from "../jewel";
import { JewelQuartet } from "../jewel-quartet";
import { OrbitAnimation } from "../jewel/orbit-animation";
import { Point } from "../types";
import { calculateAngle, calculateCenter } from "../utils";
import { JewelRemovalsGameEvent } from "./jewel-removals";

export class QuartetRotationGameEvent extends GameEvent {
  constructor(
    private quartet: JewelQuartet,
    game: TwistGame
  ) {
    super(GameEventType.QuartetRotation, game);
  }

  start(): void {
    const { grid } = this.game;
    // "justMoved" is used to determine which central jewel should become
    // the fire jewel when a match 4 is made. We'll reset them all now
    grid.getAllJewels().forEach((jewel) => (jewel.justMoved = false));

    const { quartet } = this;
    const topLeftJewel = grid.getJewelAtPosition(quartet.topLeftPosition);
    const topRightJewel = grid.getJewelAtPosition(quartet.topRightPosition);
    const bottomLeftJewel = grid.getJewelAtPosition(quartet.bottomLeftPosition);
    const bottomRightJewel = grid.getJewelAtPosition(
      quartet.bottomRightPosition
    );
    const rotationParticipants = [
      topLeftJewel,
      topRightJewel,
      bottomRightJewel,
      bottomLeftJewel,
    ];
    const rotationCenter = calculateCenter(
      quartet.positions.map((cellPosition) =>
        getJewelPixelPosition(cellPosition.y, cellPosition.x)
      )
    );
    rotationParticipants.forEach((jewel) => {
      jewel.justMoved = true;
    });

    this.startOrbitingAnimation(
      topLeftJewel,
      rotationCenter,
      topRightJewel.pixelPosition
    );
    this.startOrbitingAnimation(
      topRightJewel,
      rotationCenter,
      bottomRightJewel.pixelPosition
    );
    this.startOrbitingAnimation(
      bottomRightJewel,
      rotationCenter,
      bottomLeftJewel.pixelPosition
    );
    this.startOrbitingAnimation(
      bottomLeftJewel,
      rotationCenter,
      topLeftJewel.pixelPosition
    );
  }

  onComplete(): void {
    const { grid, gameEventManager } = this.game;
    const { quartet } = this;
    const topLeftJewel = grid.getJewelAtPosition(quartet.topLeftPosition);
    const topRightJewel = grid.getJewelAtPosition(quartet.topRightPosition);
    const bottomLeftJewel = grid.getJewelAtPosition(quartet.bottomLeftPosition);
    const bottomRightJewel = grid.getJewelAtPosition(
      quartet.bottomRightPosition
    );
    grid.putJewelInPosition(quartet.topRightPosition, topLeftJewel);
    grid.putJewelInPosition(quartet.bottomRightPosition, topRightJewel);
    grid.putJewelInPosition(quartet.bottomLeftPosition, bottomRightJewel);
    grid.putJewelInPosition(quartet.topLeftPosition, bottomLeftJewel);
    grid.updateCountingJewels();
    grid.assignMarkedBeforeLockAndUpdateToLockedJewels();
    gameEventManager.addEvent(new JewelRemovalsGameEvent(this.game));
  }

  startOrbitingAnimation(
    jewelToRotate: Jewel,
    rotationCenter: Point,
    destinationPosition: Point
  ) {
    const originalAngle = calculateAngle(
      rotationCenter,
      jewelToRotate.pixelPosition
    );

    const destinationAngle = calculateAngle(
      rotationCenter,
      destinationPosition
    );

    jewelToRotate.animations.push(
      new OrbitAnimation(
        rotationCenter,
        originalAngle,
        destinationAngle,
        jewelToRotate,
        () => {}
      )
    );
  }
}

import { GameEvent, GameEventType } from ".";
import { AnimationRegistry } from "../animation-registry";
import { gameEventManager, grid } from "../App";
import { Jewel } from "../jewel";
import { JewelQuartet, Point } from "../jewel-quartet";
import { RotationAnimation } from "../jewel/rotation-animation";
import { calculateAngle, calculateCenter } from "../utils";
import { JewelRemovalsGameEvent } from "./jewel-removals";

export class QuartetRotationGameEvent extends GameEvent {
  animationRegistry = new AnimationRegistry();
  constructor(private quartet: JewelQuartet) {
    super(GameEventType.QuartetRotation);
  }

  start(): void {
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
      rotationParticipants.map((participant) => participant.pixelPosition)
    );
    rotationParticipants.forEach((jewel) => {
      jewel.justMoved = true;
    });

    this.startRotationAnimation(
      quartet.topLeftPosition,
      topLeftJewel,
      rotationCenter,
      topRightJewel.pixelPosition
    );
    this.startRotationAnimation(
      quartet.topRightPosition,
      topRightJewel,
      rotationCenter,
      bottomRightJewel.pixelPosition
    );
    this.startRotationAnimation(
      quartet.bottomRightPosition,
      bottomRightJewel,
      rotationCenter,
      bottomLeftJewel.pixelPosition
    );
    this.startRotationAnimation(
      quartet.bottomLeftPosition,
      bottomLeftJewel,
      rotationCenter,
      topLeftJewel.pixelPosition
    );
  }

  onComplete(): void {
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

    gameEventManager.addEvent(new JewelRemovalsGameEvent());
  }

  startRotationAnimation(
    cellPositionOrigin: Point,
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

    this.animationRegistry.register(cellPositionOrigin);

    jewelToRotate.rotationAnimation = new RotationAnimation(
      rotationCenter,
      originalAngle,
      destinationAngle,
      jewelToRotate,
      () => {
        this.animationRegistry.unregister(cellPositionOrigin);
        if (this.animationRegistry.isEmpty()) {
          this.isComplete = true;
        }
      }
    );
  }
}

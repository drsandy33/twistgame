import { gridRefiller, gridUpdater, inputManager, matchChecker } from "./App";

export function queueGridEvaluation() {
  gridUpdater.shouldUpdateOnNextFrame = true;
}

export function evaluateAndUpdateGrid() {
  const matches = matchChecker.checkForMatches();
  if (matches.length === 0) inputManager.isLocked = false;
  gridRefiller.createReplacements();
  gridUpdater.shouldUpdateOnNextFrame = false;
}

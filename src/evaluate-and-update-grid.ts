import { gridRefiller, inputManager, matchChecker } from "./App";
export function evaluateAndUpdateGrid() {
  const matches = matchChecker.checkForMatches();
  if (matches.length === 0) inputManager.isLocked = false;
  gridRefiller.createReplacements();
}

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { immerable, produce } from "immer";
import { MutateState } from "./mutate-state";
import { GameEventType } from "../game-event-manager";

export class GameState {
  [immerable] = true;
  loading: boolean = true;
  numJewels: number = 0;
  numJewelsRemoved: number = 0;
  isGameOver: boolean = false;
  currentlyProcessingEventType: null | GameEventType = null;
  showDebug: boolean = false;

  constructor(
    public mutateState: MutateState<GameState>,
    public get: () => GameState
  ) {}
}

export const useGameStore = create<GameState>()(
  immer(
    devtools(
      (set, get) =>
        new GameState(
          (fn: (state: GameState) => void) => set(produce(fn)),
          get
        ),
      {
        enabled: true,
        name: "game store",
      }
    )
  )
);

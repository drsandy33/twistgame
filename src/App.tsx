import { useEffect } from "react";
import "./App.css";
import { ImageManager } from "./image-manager";
import {
  JEWEL_COLOR_URLS,
  JEWEL_TYPE_INDICATOR_URLS,
} from "./jewel/jewel-consts";
import { TwistGame } from "./game";
import GameBoard from "./GameBoard";
import { enableMapSet } from "immer";
import { useGameStore } from "./stores/game-store";
import DebugDisplay from "./components/DebugDisplay";
// for immer to be able to use map and set
enableMapSet();

export const gameSingletonHolder: { game: null | TwistGame } = { game: null };
export const imageManager = new ImageManager();

function App() {
  const mutateGameState = useGameStore().mutateState;
  const showDebug = useGameStore().showDebug;
  const numJewelsRemoved = useGameStore().numJewelsRemoved;
  const currentLevel = useGameStore().currentLevel;

  useEffect(() => {
    const jewelImageURLs = Object.values(JEWEL_COLOR_URLS);
    const indicatorURLs = Object.values(JEWEL_TYPE_INDICATOR_URLS);
    const allURLs = jewelImageURLs.concat(indicatorURLs);
    imageManager.loadImages(allURLs, () => {
      mutateGameState((state) => {
        state.loading = false;
      });
    });
  }, []);

  return (
    <div className="bg-slate-700 h-screen text-zinc-300">
      <div className="p-4 flex flex-col items-center justify-center">
        <div className="h-[4px] w-full bg-zinc-300" />
        <h1 className="text-zinc-300 text-3xl font-bold pt-2 pb-2">
          twistgame (title TBD)
        </h1>
        <div className="h-[4px] w-full bg-zinc-300" />
      </div>
      <div className="flex justify-center">
        <div className="flex justify-center w-full max-w-[1080px] p-4 pt-0">
          <div className="w-72 border-[3px] border-zinc-300 mr-2 p-2 pt-4">
            <h3 className="text-2xl text-center">Score</h3>
            <h3 className="text-2xl text-center">{numJewelsRemoved}</h3>
            <h3 className="text-2xl text-center">Level</h3>
            <h3 className="text-2xl text-center">{currentLevel}</h3>
          </div>
          <GameBoard />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <button
          onClick={() => {
            mutateGameState((state) => {
              state.showDebug = !state.showDebug;
            });
          }}
          className="border border-zinc-300 text-lg p-2"
        >
          {showDebug ? "hide" : "show"} debug
        </button>
      </div>

      {showDebug && <DebugDisplay />}
    </div>
  );
}

export default App;

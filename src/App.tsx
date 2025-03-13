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
  const isGameOver = useGameStore().isGameOver;
  const showDebug = useGameStore().showDebug;

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

  function handleNewGameClick() {
    const { game } = gameSingletonHolder;
    if (game !== null) game.reset();
  }

  return (
    <div className="bg-slate-700 h-screen">
      <div className="p-4 flex flex-col items-center">
        <div className="h-[4px] w-full bg-zinc-300" />
        <h1 className="text-zinc-300 text-3xl font-bold pt-2 pb-2">
          twistgame (title TBD)
        </h1>
        <div className="h-[4px] w-full bg-zinc-300" />
      </div>
      <div className="flex justify-center w-full max-w-[1080px] p-4 pt-0">
        <div className="w-72 border-[3px] border-zinc-300 mr-2">score etc</div>
        <GameBoard />
      </div>
      <dialog open={isGameOver} className="dialog">
        <h3>GAME OVER !!!</h3>
        <button onClick={handleNewGameClick}>Play Again</button>
      </dialog>
      {showDebug && <DebugDisplay />}
    </div>
  );
}

export default App;

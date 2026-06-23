import type { InitGameConfig } from "../../config/gameConfig";
import { BOTTOM_BAR_SIZE, TOP_BAR_SIZE } from "../../config/gameDisplayConfig";
import { Dir } from "../../lib/Dir";
import Model from "../model/Model";
import View from "../view/View";

class Controller {
  private _model: Model;
  private _view: View;
  private _gameConfig: Pick<InitGameConfig, "gameLoopTimeMs">;
  private _lastTimeMs = 0;
  private _timeAccumulatorMs = 0;
  constructor(initGameConfig: InitGameConfig) {
    this._gameConfig = {
      gameLoopTimeMs: initGameConfig.gameLoopTimeMs,
    };
    this._model = new Model(
      initGameConfig.wallData,
      initGameConfig.coinData,
      initGameConfig.superCoinsPos,
      initGameConfig.pacmanPos,
      initGameConfig.ghostsSpawnerPos,
      initGameConfig.ghostsDifficultyStages,
      initGameConfig.portalPos,
      initGameConfig.blueGhostModeTimeMs,
    );

    this._view = new View(initGameConfig.rowsAmount, TOP_BAR_SIZE, BOTTOM_BAR_SIZE);
    this.initEventListeners();
    requestAnimationFrame(this.gameLoop);
  }

  gameLoop = (timestampMs: number) => {
    if (this._lastTimeMs === 0) {
      this._lastTimeMs = timestampMs;
    }

    const deltaTime = timestampMs - this._lastTimeMs;
    this._lastTimeMs = timestampMs;
    this._timeAccumulatorMs += deltaTime;

    while (this._timeAccumulatorMs >= this._gameConfig.gameLoopTimeMs) {
      this._model.update(this._gameConfig.gameLoopTimeMs);

      this._timeAccumulatorMs -= this._gameConfig.gameLoopTimeMs;
    }

    this._view.draw(this._model.getState());

    requestAnimationFrame(this.gameLoop);
  };

  private initEventListeners() {
    document.addEventListener("keydown", (ev) => {
      const key = ev.key.toLocaleLowerCase();

      if (key === "w" || key === "arrowup") {
        this._model.setPacmanSelectedDir(new Dir(0, -1));
      } else if (key === "s" || key === "arrowdown") {
        this._model.setPacmanSelectedDir(new Dir(0, 1));
      } else if (key === "a" || key === "arrowleft") {
        this._model.setPacmanSelectedDir(new Dir(-1, 0));
      } else if (key === "d" || key === "arrowright") {
        this._model.setPacmanSelectedDir(new Dir(1, 0));
      }
    });
  }
}

export default Controller;

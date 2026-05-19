import type { InitGameConfig } from "../../config/gameConfig";
import { BOTTOM_BAR_SIZE, TOP_BAR_SIZE } from "../../config/gameDisplayConfig";
import { Dir } from "../../lib/Dir";
import wait from "../../lib/wait";
import Model from "../model/Model";
import View from "../view/View";

class Controller {
  private _model: Model;
  private _view: View;
  private _gameConfig: Pick<
    InitGameConfig,
    "gameLoopTimeMs" | "ghostsDifficultyStages"
  >;
  constructor(initGameConfig: InitGameConfig) {
    this._gameConfig = {
      gameLoopTimeMs: initGameConfig.gameLoopTimeMs,
      ghostsDifficultyStages: initGameConfig.ghostsDifficultyStages,
    };
    this._model = new Model(
      initGameConfig.wallData,
      initGameConfig.coinData,
      initGameConfig.superCoinsPos,
      initGameConfig.pacmanPos,
      initGameConfig.portalPos,
    );

    this._view = new View(
      initGameConfig.rowsAmount,
      TOP_BAR_SIZE,
      BOTTOM_BAR_SIZE,
    );
    this.gameLoop();
    this.initEventListeners();
  }

  async gameLoop() {
    while (true) {
      this._model.pacman.move();
      this._model.ghosts.move();
      this._model.pacman.collectCoin();
      this._view.draw(
        this._model.getWallData(),
        this._model.getCoinData(),
        this._model.pacman.getPos(),
        this._model.pacman.findSecondPacmanPos(),
        this._model.ghosts.getPos(),
        this._model.getScore(),
      );
      await wait(this._gameConfig.gameLoopTimeMs);
    }
  }

  private initEventListeners() {
    document.addEventListener("keydown", (ev) => {
      const key = ev.key.toLocaleLowerCase();

      if (key === "w" || key === "arrowup") {
        this._model.pacman.setSelectedDir(new Dir(0, -1));
      } else if (key === "s" || key === "arrowdown") {
        this._model.pacman.setSelectedDir(new Dir(0, 1));
      } else if (key === "a" || key === "arrowleft") {
        this._model.pacman.setSelectedDir(new Dir(-1, 0));
      } else if (key === "d" || key === "arrowright") {
        this._model.pacman.setSelectedDir(new Dir(1, 0));
      }
    });
  }
}

export default Controller;

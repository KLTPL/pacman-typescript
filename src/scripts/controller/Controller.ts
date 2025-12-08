import { Dir } from "../../lib/Dir";
import { Pos } from "../../lib/Pos";
import wait from "../../lib/wait";
import Model from "../model/Model";
import View from "../view/View";

const ROWS_AMOUNT = 28;
const GAME_LOOP_TIME_MS = 20;

class Controller {
  private _model = new Model(
    Controller.getInputWallData(),
    Controller.getInputCoinData(),
    Controller.getSuperCoinsPos(),
    Controller.getInputPacmanPos()
  );
  private _view = new View(ROWS_AMOUNT);
  constructor() {
    this.gameLoop();
    this.initEventListeners();
  }

  async gameLoop() {
    while (true) {
      this._model.pacman.move();
      this._model.pacman.collectCoin();
      this._view.drawBoard(
        this._model.getWallData(),
        this._model.getCoinData(),
        this._model.pacman.getPos()
      );
      await wait(GAME_LOOP_TIME_MS);
    }
  }

  private initEventListeners() {
    document.addEventListener("keydown", ev => {
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

  private static getInputWallData(): number[][] {
    return [
      // positive - amount of walls, negative - amount of empty fields
      [28],
      [1, -6, 2, -10, 2, -6, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -26, 1],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [-4, 2, -7, 2, -7, 2, -4],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -22, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -1, 2, -4, 8, -4, 2, -1, 3],
      [3, -1, 2, -1, 2, -1, 8, -1, 2, -1, 2, -1, 3],
      [3, -1, 2, -1, 2, -1, 8, -1, 2, -1, 2, -1, 3],
      [-7, 2, -10, 2, -7],
      [3, -1, 8, -1, 2, -1, 8, -1, 3],
      [3, -1, 8, -1, 2, -1, 8, -1, 3],
      [3, -10, 2, -10, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [1, -26, 1],
      [1, -1, 4, -1, 5, -1, 2, -1, 5, -1, 4, -1, 1],
      [1, -1, 4, -1, 5, -1, 2, -1, 5, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -4, 2, -4, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -26, 1],
      [28],
    ];
  }

  private static getInputCoinData(): number[][] {
    return [
      // positive - amount of no-coin fields, negative - amount of coin fields
      [28],
      [1, -6, 2, -10, 2, -6, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -26, 1],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [3, -1, 2, -7, 2, -7, 2, -1, 3],
      [3, -1, 5, 1, 8, 1, 5, -1, 3],
      [3, -1, 5, 1, 8, 1, 5, -1, 3],
      [3, -1, 20, -1, 3],
      [3, -1, 5, 1, 8, 1, 5, -1, 3],
      [3, -1, 5, 1, 8, 1, 5, -1, 3],
      [3, -1, 2, 4, 8, 4, 2, -1, 3],
      [3, -1, 2, 1, 2, 1, 8, 1, 2, 1, 2, -1, 3],
      [3, -1, 2, 1, 2, 1, 8, 1, 2, 1, 2, -1, 3],
      [3, -1, 3, 2, 10, 2, 3, -1, 3],
      [3, -1, 8, 1, 2, 1, 8, -1, 3],
      [3, -1, 8, 1, 2, 1, 8, -1, 3],
      [3, -7, 3, 2, 3, -7, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [1, -12, 2, -12, 1],
      [1, -1, 4, -1, 5, -1, 2, -1, 5, -1, 4, -1, 1],
      [1, -1, 4, -1, 5, -1, 2, -1, 5, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -4, 2, -4, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -26, 1],
      [28],
    ];
  }
  private static getSuperCoinsPos(): Pos[] {
    return [new Pos(1, 2), new Pos(26, 2), new Pos(1, 27), new Pos(26, 27)];
  }

  private static getInputPacmanPos(): Pos {
    return new Pos(14, 23.5);
  }
}

export default Controller;

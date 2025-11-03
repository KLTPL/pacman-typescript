import { Dir } from "../../lib/Dir";
import type { Pos } from "../../lib/Pos";
import wait from "../../lib/wait";
import Model from "../model/Model";
import View from "../view/View";

const ROWS_AMOUNT = 28;
const GAME_LOOP_TIME_MS = 100;

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
      this._model.movePacman();
      this._view.drawBoard(
        this._model.getWallData(),
        this._model.getCoinData(),
        this._model.getPacmanData().pos
      );
      console.log("wait");
      await wait(GAME_LOOP_TIME_MS);
    }
  }

  private initEventListeners() {
    document.addEventListener("keydown", ev => {
      const key = ev.key.toLocaleLowerCase();

      if (key === "w" || key === "arrowup") {
        this._model.setPacmanDir(new Dir(0, -1));
      } else if (key === "s" || key === "arrowdown") {
        this._model.setPacmanDir(new Dir(0, 1));
      } else if (key === "a" || key === "arrowleft") {
        this._model.setPacmanDir(new Dir(-1, 0));
      } else if (key === "d" || key === "arrowright") {
        this._model.setPacmanDir(new Dir(1, 0));
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
    return [
      { y: 2, x: 1 },
      { y: 2, x: 26 },
      { y: 27, x: 1 },
      { y: 27, x: 26 },
    ];
  }

  private static getInputPacmanPos(): Pos {
    return {
      x: 13.5,
      y: 23,
    };
  }
}

export default Controller;

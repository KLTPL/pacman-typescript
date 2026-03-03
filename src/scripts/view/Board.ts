import { Pos } from "../../lib/Pos";
import type { CoinValue } from "../model/Model";
import { COLORS, type DrawCircleArgs, type DrawRectArgs } from "./View";

const RADII = {
  COIN: 0.1,
  SUPER_COIN: 0.3,
} as const;

type DrawRectFun = (args: DrawRectArgs) => void;
type DrawCirlceFun = (args: DrawCircleArgs) => void;

class Board {
  private _drawRect: DrawRectFun;
  private _drawCircle: DrawCirlceFun;
  private _clear: () => void;
  constructor(
    drawRect: DrawRectFun,
    drawCircle: DrawCirlceFun,
    clear: () => void,
  ) {
    this._drawRect = drawRect;
    this._drawCircle = drawCircle;
    this._clear = clear;
  }

  public drawBoard(
    wallData: boolean[][],
    coinData: CoinValue[][],
    pacmanPos: Pos,
    secondPacmanPos: Pos | null,
  ) {
    this._clear();
    this.drawWalls(wallData);
    this.drawPacman(pacmanPos, secondPacmanPos);
    this.drawCoins(coinData);
  }

  private drawWalls(wallData: boolean[][]) {
    for (let r = 0; r < wallData.length; r++) {
      for (let c = 0; c < wallData[r].length; c++) {
        if (wallData[r][c]) {
          this._drawRect({ x: c, y: r, color: COLORS.WALL });
        }
      }
    }
  }

  private drawCoins(coinData: CoinValue[][]) {
    for (let r = 0; r < coinData.length; r++) {
      for (let c = 0; c < coinData[r].length; c++) {
        const coinVal = coinData[r][c];
        if (coinVal === "COIN") {
          this._drawCircle({
            x: c + 0.5,
            y: r + 0.5,
            radius: RADII.COIN,
            color: COLORS.COIN,
          });
        } else if (coinVal === "SUPER_COIN") {
          this._drawCircle({
            x: c + 0.5,
            y: r + 0.5,
            radius: RADII.SUPER_COIN,
            color: COLORS.COIN,
          });
        }
      }
    }
  }

  private drawPacman(pacmanPos: Pos, secondPacmanPos: Pos | null) {
    this._drawCircle({
      x: pacmanPos.x,
      y: pacmanPos.y,
      radius: 0.5,
      color: COLORS.PACMAN,
    });
    if (secondPacmanPos !== null) {
      this._drawCircle({
        x: secondPacmanPos.x,
        y: secondPacmanPos.y,
        radius: 0.5,
        color: COLORS.PACMAN,
      });
    }
  }
}

export default Board;

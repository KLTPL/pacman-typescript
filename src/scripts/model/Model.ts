import { Dir } from "../../lib/Dir";
import type { Pos } from "../../lib/Pos";

export type CoinValue = "NO_COIN" | "COIN" | "SUPER_COIN";

const PACMAN_SPEED = 0.1;

class Model {
  private _wallData: boolean[][]; // true - there is a wall, false - there is no wall
  private _coinData: CoinValue[][];
  private _pacman: {
    pos: Pos;
    dir: Dir;
    selectedDir: Dir;
  };
  constructor(
    inputWallData: number[][],
    inputCoinData: number[][],
    superCoinsPos: Pos[],
    pacmanPos: Pos
  ) {
    this._wallData = this.convertInputWallData(inputWallData);
    this._coinData = this.convertInputCoinData(inputCoinData, superCoinsPos);
    this._pacman = {
      pos: pacmanPos,
      dir: new Dir(1, 0),
      selectedDir: new Dir(1, 0),
    };
  }

  public movePacman() {
    this._pacman.pos.x += this._pacman.dir.x * PACMAN_SPEED;
    this._pacman.pos.y += this._pacman.dir.y * PACMAN_SPEED;
  }

  public getWallData() {
    return this._wallData;
  }

  public getCoinData() {
    return this._coinData;
  }

  public getPacmanData() {
    return this._pacman;
  }

  public setPacmanDir(dir: Dir) {
    if (dir.isOppositeTo(this._pacman.dir)) {
      this._pacman.dir.x = dir.x;
      this._pacman.dir.y = dir.y;
    }
  }

  private convertInputWallData(inputWallData: number[][]) {
    const wallData: boolean[][] = [];

    for (let r = 0; r < inputWallData.length; r++) {
      const curr = [];
      for (let i = 0; i < inputWallData[r].length; i++) {
        for (let j = 0; j < Math.abs(inputWallData[r][i]); j++) {
          curr.push(inputWallData[r][i] > 0);
        }
      }
      wallData.push(curr);
    }

    return wallData;
  }

  private convertInputCoinData(
    inputCoinData: number[][],
    superCoinsPos: Pos[]
  ) {
    const coinData: CoinValue[][] = [];

    for (let r = 0; r < inputCoinData.length; r++) {
      const curr: CoinValue[] = [];
      for (let i = 0; i < inputCoinData[r].length; i++) {
        for (let j = 0; j < Math.abs(inputCoinData[r][i]); j++) {
          curr.push(inputCoinData[r][i] > 0 ? "NO_COIN" : "COIN");
        }
      }
      coinData.push(curr);
    }

    for (const { x, y } of superCoinsPos) {
      coinData[y][x] = "SUPER_COIN";
    }

    return coinData;
  }
}

export default Model;

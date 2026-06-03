import type { GhostsStagesList, InputPortalPos } from "../../config/gameConfig";
import type { Dir } from "../../lib/Dir";
import { Pos } from "../../lib/Pos";
import type { CoinValue, ModelState, PortalData } from "../../types/modelTypes";
import Ghosts from "./Ghosts";
import Pacman from "./Pacman";

const COIN_VALUE = 10;

class Model {
  private _wallData: boolean[][]; // true - there is a wall, false - there is no wall
  private _coinData: CoinValue[][];
  private _portalData: PortalData;
  private _pacman;
  private _ghosts;
  private _coinsOnBoard: number;
  private _score: number = 0;
  constructor(
    inputWallData: number[][],
    inputCoinData: number[][],
    superCoinsPos: Pos[],
    pacmanPos: Pos,
    ghostSpawnerPos: Pos,
    ghostsDifficultyStages: GhostsStagesList,
    inputPortalPos: InputPortalPos,
  ) {
    this._portalData = inputPortalPos;
    this._wallData = this.convertInputWallData(inputWallData);
    const { coinAmount, coinData } = this.convertInputCoinData(inputCoinData, superCoinsPos);
    this._coinData = coinData;
    this._coinsOnBoard = coinAmount;
    this._pacman = new Pacman(pacmanPos);

    this._ghosts = new Ghosts(
      ghostSpawnerPos,
      ghostsDifficultyStages,
      this._wallData,
      this._portalData,
      this._pacman.getPosition(),
    );
  }

  update(gameLoopTimeMs: number) {
    this._pacman.move(this._wallData, this._portalData);
    this._ghosts.moveGhosts(
      this._wallData,
      this._portalData,
      this._pacman.getPosition(),
      gameLoopTimeMs,
    );

    this.pacmanCollectCoin();
  }

  getState(): ModelState {
    return {
      wallData: this._wallData,
      coinData: this._coinData,
      pacmanPos: this._pacman.getPosition(),
      secondPacmanPos: this._pacman.findSecondPacmanPos(this._portalData),
      ghosts: this._ghosts.getGhostsPos(),
      score: this._score,
    };
  }

  private pacmanCollectCoin() {
    const pacmanPos = this._pacman.getPosition();

    const temp = pacmanPos.calcFieldPos();
    if (temp.length === 2) {
      // means pacman is between two fields
      return;
    } // so now temp.length === 1
    const { x, y } = temp[0];
    if (this._coinData[y][x] !== "NO_COIN") {
      this._score += this._coinData[y][x] === "COIN" ? COIN_VALUE : COIN_VALUE * 5;
      this._coinsOnBoard -= 1;
      this._coinData[y][x] = "NO_COIN";
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

  private convertInputCoinData(inputCoinData: number[][], superCoinsPos: Pos[]) {
    const coinData: CoinValue[][] = [];
    let coinAmount = 0;

    for (let r = 0; r < inputCoinData.length; r++) {
      const curr: CoinValue[] = [];
      for (let i = 0; i < inputCoinData[r].length; i++) {
        for (let j = 0; j < Math.abs(inputCoinData[r][i]); j++) {
          const isNoCoin = inputCoinData[r][i] > 0;
          if (!isNoCoin) {
            coinAmount++;
          }
          curr.push(isNoCoin ? "NO_COIN" : "COIN");
        }
      }
      coinData.push(curr);
    }

    for (const { x, y } of superCoinsPos) {
      coinData[y][x] = "SUPER_COIN";
    }

    return { coinData, coinAmount };
  }

  public getWallData() {
    return this._wallData;
  }

  public getCoinData() {
    return this._coinData;
  }

  public getPortalData() {
    return this._portalData;
  }

  public getScore() {
    return this._score;
  }

  public setPacmanSelectedDir(selectedDir: Dir) {
    this._pacman.setSelectedDir(selectedDir);
  }

  public static isPosOutOfBounds(pos: Pos, wallData: boolean[][]) {
    return wallData[pos.y] === undefined || wallData[pos.y][pos.x] === undefined;
  }
}

export default Model;

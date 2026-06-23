import type { GhostsStagesList, InputPortalPos } from "../../config/gameConfig";
import type { Dir } from "../../lib/Dir";
import { Pos } from "../../lib/Pos";
import Timer from "../../lib/Timer";
import type { CoinValue, ModelState, PortalData } from "../../types/modelTypes";
import Ghosts from "./Ghosts";
import Pacman from "./Pacman";

const COIN_VALUE = 10;
const LIVES_AMOUNT = 3;
const HIGH_SCORE_KEY = "HIGH_SCORE";

class Model {
  private _wallData: boolean[][]; // true - there is a wall, false - there is no wall
  private _coinData: CoinValue[][];
  private _portalData: PortalData;
  private _pacman;
  private _ghosts;
  private _coinsOnBoard: number;
  private _score: number = 0;
  private _highScore: number = this.readHighScoreFromLocalStorage();
  private _lives: number = LIVES_AMOUNT;
  private _blueGhostModeTimer: Timer | null = null;
  private _blueGhostModeTimeMs = 0;
  private initCoinObj: {
    coinData: CoinValue[][];
    coinAmount: number;
  };
  constructor(
    inputWallData: number[][],
    inputCoinData: number[][],
    superCoinsPos: Pos[],
    pacmanPos: Pos,
    ghostSpawnerPos: Pos,
    ghostsDifficultyStages: GhostsStagesList,
    inputPortalPos: InputPortalPos,
    blueGhostModeTimeMs: number,
  ) {
    this._portalData = inputPortalPos;
    this._wallData = this.convertInputWallData(inputWallData);
    this.initCoinObj = this.convertInputCoinData(inputCoinData, superCoinsPos);
    this._coinData = this.initCoinObj.coinData.map((el) => [...el]);
    this._coinsOnBoard = this.initCoinObj.coinAmount;
    this._pacman = new Pacman(pacmanPos);
    this._blueGhostModeTimeMs = blueGhostModeTimeMs;

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

    this.checkCollisions();

    this._blueGhostModeTimer?.update(gameLoopTimeMs);
    if (this._blueGhostModeTimer?.isOver()) {
      this._blueGhostModeTimer = null;
    }
  }

  getState(): ModelState {
    return {
      wallData: this._wallData,
      coinData: this._coinData,
      pacmanPos: this._pacman.getPosition(),
      secondPacmanPos: this._pacman.findSecondPacmanPos(this._portalData),
      ghosts: this._ghosts.getGhostsPos(),
      score: this._score,
      highScore: this._highScore,
      lives: this._lives,
      isBlueGhostMode: this._blueGhostModeTimer !== null,
    };
  }

  private checkCollisions() {
    const pacmanPos = this._pacman.getPosition();

    for (const ghostPos of this._ghosts.getGhostsPos()) {
      const distObj = pacmanPos.calcDistanceInLineToPos(ghostPos);
      if (distObj !== null && distObj.dist < 1) {
        this._pacman.reset();
        this._lives--;

        if (this._lives > 0) {
          this._ghosts.resetPos(this._wallData, this._portalData, pacmanPos);
        } else {
          this._ghosts.resetPosAndStage(this._wallData, this._portalData, pacmanPos);
          this._lives = LIVES_AMOUNT;
          this._coinData = this.initCoinObj.coinData.map((el) => [...el]);
          this._coinsOnBoard = this.initCoinObj.coinAmount;
          if (this._score > this._highScore) {
            this._highScore = this._score;
            localStorage.setItem(HIGH_SCORE_KEY, this._highScore.toString());
          }
          this._score = 0;
        }
      }
    }
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
      const isSuperCoin = this._coinData[y][x] === "SUPER_COIN";
      this._score += isSuperCoin ? COIN_VALUE * 5 : COIN_VALUE;
      this._coinsOnBoard -= 1;
      this._coinData[y][x] = "NO_COIN";

      if (isSuperCoin) {
        this._blueGhostModeTimer = new Timer(this._blueGhostModeTimeMs);
      }
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

  private readHighScoreFromLocalStorage(): number {
    const highScoreStr = localStorage.getItem(HIGH_SCORE_KEY);

    if (highScoreStr === null) {
      return 0;
    }
    const highScore = Number(highScoreStr);

    if (isNaN(highScore)) {
      return 0;
    }

    return highScore;
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

  public setPacmanSelectedDir(selectedDir: Dir) {
    this._pacman.setSelectedDir(selectedDir);
  }

  public static isPosOutOfBounds(pos: Pos, wallData: boolean[][]) {
    return wallData[pos.y] === undefined || wallData[pos.y][pos.x] === undefined;
  }
}

export default Model;

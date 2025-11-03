import type { Pos } from "../../lib/Pos";
import type { CoinValue } from "../model/Model";

const RADII = {
  COIN: 0.1,
  SUPER_COIN: 0.3,
} as const;

const COLORS = {
  WALL: "blue",
  COIN: "white",
  PACMAN: "RED",
} as const;

class View {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _widthPx: number;
  private _heightPx: number;
  private _fieldSizePx: number;
  constructor(fieldsX: number) {
    this._canvas = document.getElementById("game") as HTMLCanvasElement;
    this._ctx = this._canvas.getContext("2d")!;
    this._widthPx = this._canvas.width;
    this._heightPx = this._canvas.height;
    this._fieldSizePx = this._widthPx / fieldsX;
  }

  public drawBoard(
    wallData: boolean[][],
    coinData: CoinValue[][],
    pacmanPos: Pos
  ) {
    this.clearCanvas();
    this.drawWalls(wallData);
    this.drawCoins(coinData);
    this.drawPacman(pacmanPos);
  }

  private drawWalls(wallData: boolean[][]) {
    for (let r = 0; r < wallData.length; r++) {
      for (let c = 0; c < wallData[r].length; c++) {
        if (wallData[r][c]) {
          this.drawRect(c, r, COLORS.WALL);
        }
      }
    }
  }

  private drawCoins(coinData: CoinValue[][]) {
    for (let r = 0; r < coinData.length; r++) {
      for (let c = 0; c < coinData[r].length; c++) {
        const coinVal = coinData[r][c];
        if (coinVal === "COIN") {
          this.drawCircle(c, r, RADII.COIN, COLORS.COIN);
        } else if (coinVal === "SUPER_COIN") {
          this.drawCircle(c, r, RADII.SUPER_COIN, COLORS.COIN);
        }
      }
    }
  }

  private drawPacman(pacmanPos: Pos) {
    console.log(pacmanPos);
    this.drawCircle(pacmanPos.x, pacmanPos.y, 0.5, COLORS.PACMAN);
  }

  private drawRect(x: number, y: number, color: string) {
    this._ctx.fillStyle = color;
    this._ctx.fillRect(
      x * this._fieldSizePx,
      y * this._fieldSizePx,
      this._fieldSizePx,
      this._fieldSizePx
    );
  }

  private drawCircle(x: number, y: number, radius: number, color: string) {
    this._ctx.fillStyle = color;
    this._ctx.beginPath();
    this._ctx.arc(
      x * this._fieldSizePx + 0.5 * this._fieldSizePx,
      y * this._fieldSizePx + 0.5 * this._fieldSizePx,
      radius * this._fieldSizePx,
      0,
      2 * Math.PI
    );
    this._ctx.fill();
  }

  private clearCanvas() {
    this._ctx.clearRect(0, 0, this._widthPx, this._heightPx);
  }
}

export default View;

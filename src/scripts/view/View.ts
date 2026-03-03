import type { Pos } from "../../lib/Pos";
import type { CoinValue } from "../model/Model";
import Board from "./Board";

export const COLORS = {
  WALL: "blue",
  COIN: "white",
  PACMAN: "yellow",
} as const;

export type DrawRectArgs = {
  x: number;
  y: number;
  color: string;
};
export type DrawCircleArgs = {
  x: number;
  y: number;
  radius: number;
  color: string;
};

class View {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _widthPx: number;
  private _heightPx: number; // top bar + board + bottom bar
  private _fieldSizePx: number;
  private _topBarSize: number;
  private _bottomBarSize: number;
  private _board;

  constructor(rowsSize: number, topBarSize: number, bottomBarSize: number) {
    this._canvas = document.getElementById("game") as HTMLCanvasElement;
    this._ctx = this._canvas.getContext("2d")!;
    this._widthPx = this._canvas.width;
    this._heightPx = this._canvas.height;
    this._fieldSizePx = this._widthPx / rowsSize;
    this._topBarSize = topBarSize;
    this._bottomBarSize = bottomBarSize;
    this._board = new Board(
      args =>
        this.drawRect({
          ...args,
          y: args.y + this._topBarSize,
        }),
      args => this.drawCircle({ ...args, y: args.y + this._topBarSize }),
      () =>
        this._ctx.clearRect(
          0,
          this._topBarSize * this._fieldSizePx,
          this._widthPx,
          this._heightPx -
            (this._bottomBarSize + this._topBarSize) * this._fieldSizePx,
        ),
    );
  }

  public draw(
    wallData: boolean[][],
    coinData: CoinValue[][],
    pacmanPos: Pos,
    secondPacmanPos: Pos | null,
    score: number,
  ) {
    this._ctx.clearRect(0, 0, this._widthPx, this._heightPx);
    this.drawScore(score);
    this._board.drawBoard(wallData, coinData, pacmanPos, secondPacmanPos);
  }

  private drawScore(score: number) {
    this._ctx.fillStyle = "white";
    this._ctx.font = "100px Arial";
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    this._ctx.fillText(
      score.toString(),
      this._widthPx / 2,
      (this._topBarSize * this._fieldSizePx) / 2,
    );
  }

  private drawRect({ color, x, y }: DrawRectArgs) {
    this._ctx.fillStyle = color;
    this._ctx.fillRect(
      x * this._fieldSizePx,
      y * this._fieldSizePx,
      this._fieldSizePx,
      this._fieldSizePx,
    );
  }

  private drawCircle({ x, y, color, radius }: DrawCircleArgs): void {
    this._ctx.fillStyle = color;
    this._ctx.beginPath();
    this._ctx.arc(
      x * this._fieldSizePx,
      y * this._fieldSizePx,
      radius * this._fieldSizePx,
      0,
      2 * Math.PI,
    );
    this._ctx.fill();
  }
}

export default View;

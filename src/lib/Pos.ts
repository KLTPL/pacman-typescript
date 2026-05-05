import type { Dir } from "./Dir";

export class Pos {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public isEqualTo(pos: Pos) {
    return this.x === pos.x && this.y === pos.y;
  }

  public calcDistanceInLineToPos(
    pos: Pos,
    isDistAbs: boolean = true,
  ): { dist: number; axis: "x" | "y" } | null {
    if (this.x === pos.x) {
      const dist = this.y - pos.y;
      return { dist: isDistAbs ? Math.abs(dist) : dist, axis: "y" };
    } else if (this.y === pos.y) {
      const dist = this.x - pos.x;
      return { dist: isDistAbs ? Math.abs(dist) : dist, axis: "x" };
    }
    return null;
  }

  isInCenter(): boolean {
    const isXPointFive = (x: number) =>
      Number((x - 0.5).toFixed(3)) === Math.floor(x);
    return isXPointFive(this.x) && isXPointFive(this.y);
  }

  calcFieldPos(): Pos[] {
    const isXPointFive = (x: number) =>
      Number((x - 0.5).toFixed(3)) === Math.floor(x); // is like x.5 (x % 0.5 == 0 && !isInteger(x))

    if (isXPointFive(this.y) && Number.isInteger(this.x)) {
      return [
        new Pos(this.x, Math.floor(this.y)),
        new Pos(this.x - 1, Math.floor(this.y)),
      ];
    } else if (isXPointFive(this.x) && Number.isInteger(this.y)) {
      return [
        new Pos(Math.floor(this.x), this.y),
        new Pos(Math.floor(this.x), this.y - 1),
      ];
    } else {
      return [new Pos(Math.floor(this.x), Math.floor(this.y))];
    }
  }

  public static addDirToPos(pos: Pos, dir: Dir, dirMultiplier: number = 1) {
    return new Pos(
      Number((pos.x + dir.x * dirMultiplier).toFixed(3)),
      Number((pos.y + dir.y * dirMultiplier).toFixed(3)),
    );
  }
}

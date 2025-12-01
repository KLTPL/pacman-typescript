import { Dir } from "../../lib/Dir";
import { Pos } from "../../lib/Pos";

const PACMAN_SPEED = 0.1;

export default class Pacman {
  private _pos: Pos;
  private _dir = new Dir(1, 0);
  private _selectedDir = new Dir(1, 0);
  constructor(pos: Pos) {
    this._pos = pos;
  }

  private isWallInFront(wallData: boolean[][], dir: Dir = this._dir) {
    const isInCenter = this._pos.isInCenter();

    const isPerpendicular =
      !this._dir.isOppositeTo(dir) && !this._dir.isEqualTo(dir);

    if (!isInCenter) {
      return isPerpendicular;
    }

    const fieldPosArr = this._pos.calcFieldPos(); // should always be 1-element list becouse pacman is in center
    if (fieldPosArr.length !== 1) {
      throw new Error("Pacman pos not in center");
    }
    const wallPos = Pos.addDirToPos(fieldPosArr[0], dir);
    if (
      wallData[wallPos.y] === undefined ||
      wallData[wallPos.y][wallPos.x] === undefined
    ) {
      throw new Error("Position out of bounds");
    }
    const isWall = wallData[wallPos.y][wallPos.x];

    return isWall;
  }

  public move(wallData: boolean[][]) {
    if (this._dir.isOppositeTo(this._selectedDir)) {
      this.setDir(this._selectedDir);
    } else if (!this._dir.isEqualTo(this._selectedDir)) {
      // directions are perpendicular
      if (!this.isWallInFront(wallData, this._selectedDir)) {
        this.setDir(this._selectedDir);
      }
    }

    if (!this._pos.isInCenter() || !this.isWallInFront(wallData)) {
      this._pos = Pos.addDirToPos(this._pos, this._dir, PACMAN_SPEED);
    }
  }

  public setSelectedDir(selectedDir: Dir) {
    this._selectedDir.x = selectedDir.x;
    this._selectedDir.y = selectedDir.y;
  }

  private setDir(dir: Dir) {
    this._dir.x = dir.x;
    this._dir.y = dir.y;
  }

  public getPosition() {
    return new Pos(this._pos.x, this._pos.y);
  }
}

import { Dir } from "../../lib/Dir";
import { Pos } from "../../lib/Pos";
import type { PortalData } from "./Model";

const PACMAN_SPEED = 0.1;

export default class Pacman {
  private _pos: Pos;
  private _dir = new Dir(1, 0);
  private _selectedDir = new Dir(1, 0);
  private _isSelectedDirEnabled = true; // swithced to false for one move after teleporting
  constructor(pos: Pos) {
    this._pos = pos;
  }

  private isWallInFront(
    wallData: boolean[][],
    portalData: PortalData,
    dir: Dir = this._dir,
  ) {
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

    // check if there's a portal
    for (const { start } of portalData) {
      if (start.isEqualTo(wallPos)) {
        return false;
      }
    }

    // check if out of bounds
    if (
      wallData[wallPos.y] === undefined ||
      wallData[wallPos.y][wallPos.x] === undefined
    ) {
      return true;
    }
    const isWall = wallData[wallPos.y][wallPos.x];

    return isWall;
  }

  public move(wallData: boolean[][], portalData: PortalData) {
    if (this._isSelectedDirEnabled) {
      // change this._dir to this._selected direction if possible
      if (this._dir.isOppositeTo(this._selectedDir)) {
        this.setDir(this._selectedDir);
      } else if (!this._dir.isEqualTo(this._selectedDir)) {
        // directions are perpendicular
        if (!this.isWallInFront(wallData, portalData, this._selectedDir)) {
          this.setDir(this._selectedDir);
        }
      }
    } else {
      this._isSelectedDirEnabled = true;
    }

    // move in direction = this._dir
    if (!this._pos.isInCenter() || !this.isWallInFront(wallData, portalData)) {
      this._pos = Pos.addDirToPos(this._pos, this._dir, PACMAN_SPEED);
    }

    for (let i = 0; i < portalData.length; i++) {
      const { start, end } = portalData[i];

      if (
        this._pos.isInCenter() &&
        start.isEqualTo(this._pos.calcFieldPos()[0]) // if in center calcFieldPos returns one el list
      ) {
        this._pos.x = end.x + 0.5 + this._dir.x;
        this._pos.y = end.y + 0.5 + this._dir.y;
        this._isSelectedDirEnabled = false;
        break;
      }
    }
  }

  public findSecondPacmanPos(portalData: PortalData): Pos | null {
    let secondPacmanPos: Pos | null = null;
    for (let i = 0; i < portalData.length; i++) {
      const { start, end } = portalData[i];

      const distObj = new Pos(
        start.x + 0.5,
        start.y + 0.5,
      ).calcDistanceInLineToPos(this._pos);

      if (distObj !== null && distObj.dist !== 0 && distObj.dist < 1) {
        if (distObj.axis === "x") {
          const dir = start.x + 0.5 - this._pos.x > 0 ? 1 : -1;
          secondPacmanPos = new Pos(
            end.x + (1 - distObj.dist) * dir + 0.5,
            end.y + 0.5,
          );
        } else {
          const dir = start.y + 0.5 - this._pos.y > 0 ? 1 : -1;
          secondPacmanPos = new Pos(
            end.x + 0.5,
            end.y + (1 - distObj.dist) * dir + 0.5,
          );
        }
        break;
      }
    }
    return secondPacmanPos;
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

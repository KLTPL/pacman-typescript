import { GHOST_SPEED } from "../../lib/constants";
import { Dir } from "../../lib/Dir";
import { Pos } from "../../lib/Pos";
import type { PortalData } from "./Model";

class Ghost {
  private _pos: Pos;
  private _currPath: Pos[] = [];
  private _currDir: Dir;
  constructor(initPos: Pos, initPath: Pos[]) {
    this._pos = initPos;
    this._currPath = [...initPath];

    this._currDir = this.calcNewDirection();
  }

  calcNewDirection() {
    this._currPath.shift();
    const destination = this._currPath[0];

    if (destination === undefined) {
      throw new Error("Path list is empty");
    }
    const x = destination.x - Math.floor(this._pos.x);
    const y = destination.y - Math.floor(this._pos.y);

    if (!Dir.isValidArg(x) || !Dir.isValidArg(y)) {
      throw new Error("At least one argument does not match Dir arg type");
    }

    return new Dir(x, y);
  }

  move(updatePath: (ghostPos: Pos) => Pos[], portalData: PortalData) {
    this._pos = Pos.addDirToPos(this._pos, this._currDir, GHOST_SPEED);

    if (this._pos.isInCenter()) {
      if (this._currPath.length === 1) {
        this.setPath(updatePath(this._pos));
      }

      this._currDir = this.calcNewDirection();
    } else {
      for (const { start, end } of portalData) {
        const distObj = this._pos.calcDistanceInLineToPos(
          new Pos(start.x + 0.5, start.y + 0.5),
          false,
        );

        if (
          distObj !== null &&
          (Math.abs(distObj.dist + 0.5) < 0.0001 ||
            Math.abs(distObj.dist) < 0.5)
        ) {
          this.setPos(
            new Pos(
              end.x + 0.5 + (1 - Math.abs(distObj.dist)) * this._currDir.x,
              end.y + 0.5 + (1 - Math.abs(distObj.dist)) * this._currDir.y,
            ),
          );
          this._currPath.shift(); // remove start portal pos from path

          break;
        }
      }
    }
  }

  getPos() {
    return new Pos(this._pos.x, this._pos.y);
  }

  setPos(newPos: Pos) {
    this._pos.x = newPos.x;
    this._pos.y = newPos.y;
  }

  getCurrPath() {
    return [...this._currPath];
  }

  isPathEmpty() {
    return this._currPath.length === 0;
  }

  setPath(path: Pos[]) {
    this._currPath = path;
  }
}

export default Ghost;

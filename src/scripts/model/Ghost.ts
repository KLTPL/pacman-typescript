import { GHOST_SPEED } from "../../lib/constants";
import { Dir } from "../../lib/Dir";
import { Pos } from "../../lib/Pos";

class Ghost {
  private _pos: Pos;
  private _currPath: Pos[] = [];
  private _currDir: Dir;
  constructor(initPos: Pos, initPath: Pos[]) {
    this._pos = initPos;
    this._currPath = [...initPath];

    console.log(JSON.stringify(this._currPath));
    this._currDir = this.calcNewDirection();

  }

  calcNewDirection() {
    this._currPath.shift();
    const destination = this._currPath[0];

    if (destination === undefined) {
      throw new Error("Path list is empty");
    }
    console.log("calc ne w direction: ", this._pos, destination)
    const x = destination.x - Math.floor(this._pos.x);
    const y = destination.y - Math.floor(this._pos.y);

    if (!Dir.isValidArg(x) || !Dir.isValidArg(y)) {
      throw new Error("At least one argument does not match Dir arg type");
    }

    return new Dir(x, y);
  }

  move(updatePath: (ghostPos: Pos) => Pos[]) {
    this._pos = Pos.addDirToPos(this._pos, this._currDir, GHOST_SPEED);
    console.log("NEW GHOST POS:", this._pos);

    if (this._pos.isInCenter()) {
      if (this._currPath.length === 1) {
        this.setPath(updatePath(this._pos));
      }
      this._currDir = this.calcNewDirection();
    }
  }

  getPos() {
    return new Pos(this._pos.x, this._pos.y);
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

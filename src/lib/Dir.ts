export class Dir {
  public x: -1 | 0 | 1;
  public y: -1 | 0 | 1;
  constructor(x: -1 | 0 | 1, y: -1 | 0 | 1) {
    this.x = x;
    this.y = y;
  }

  public isEqualTo(dir: Dir) {
    return this.x === dir.x && this.y === dir.y;
  }

  public isOppositeTo(dir: Dir) {
    return (this.x === dir.x || this.y === dir.y) && !this.isEqualTo(dir);
  }
}

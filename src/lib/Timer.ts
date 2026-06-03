export default class Timer {
  private _timeRemainingMs: number;
  constructor(timeMs: number) {
    this._timeRemainingMs = timeMs;
  }

  update(deltaTimeMs: number) {
    this._timeRemainingMs -= deltaTimeMs;
  }
  isOver() {
    return this._timeRemainingMs <= 0;
  }

  reset(timeMs: number) {
    this._timeRemainingMs += timeMs;
  }
}

import type { GhostsStagesList } from "../../config/gameConfig";
import Timer from "../../lib/Timer";

export default class GhostsStages {
  private _timer: Timer = new Timer(0);
  private _stages: GhostsStagesList;
  private _currentStageIdx = 0;
  constructor(stages: GhostsStagesList) {
    this._stages = stages;
    this.createTimer();
  }

  private createTimer() {
    if (this._stages[this._currentStageIdx].timeS === null) {
      throw new Error("");
    }
    const currStageTimeS = this._stages[this._currentStageIdx].timeS;
    this._timer = new Timer(currStageTimeS === null ? 0 : currStageTimeS * 1000);
  }

  // return if in a new stage
  update(deltaTimeMs: number) {
    this._timer.update(deltaTimeMs);
    if (this._timer.isOver() && this._stages[this._currentStageIdx].timeS !== null) {
      this._currentStageIdx++;
      const currStageTimeS = this._stages[this._currentStageIdx].timeS;
      this._timer.reset(currStageTimeS === null ? 0 : currStageTimeS * 1000);
      return true;
    }
    return false;
  }

  reset() {
    this._currentStageIdx = 0;
    this.createTimer();
  }

  getCurrentMaxDistFromPacmanForPath() {
    return this._stages[this._currentStageIdx].maxDistFromPacmanForPath;
  }
}

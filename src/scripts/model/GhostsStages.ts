import type { GhostsStagesList } from "../../config/gameConfig";
import Timer from "../../lib/Timer";

export default class GhostsStages {
  private _timer: Timer;
  private _stages: GhostsStagesList;
  private _currentStageIdx = 0;
  private _lastTimestamp = new Date();
  constructor(stages: GhostsStagesList) {
    this._stages = stages;
    if (this._stages[this._currentStageIdx].timeS === null) {
      throw new Error("");
    }
    const currStageTimeS = this._stages[this._currentStageIdx].timeS;
    this._timer = new Timer(currStageTimeS === null ? 0 : currStageTimeS * 1000);
  }

  update(deltaTimeMs: number) {
    this._timer.update(deltaTimeMs);
    if (this._timer.isOver() && this._stages[this._currentStageIdx].timeS !== null) {
      console.log(new Date().getTime() - this._lastTimestamp.getTime());
      this._lastTimestamp = new Date();
      this._currentStageIdx++;
      const currStageTimeS = this._stages[this._currentStageIdx].timeS;
      this._timer.reset(currStageTimeS === null ? 0 : currStageTimeS * 1000);
    }
  }

  getCurrentMaxDistFromPacmanForPath() {
    return this._stages[this._currentStageIdx].maxDistFromPacmanForPath;
  }
}

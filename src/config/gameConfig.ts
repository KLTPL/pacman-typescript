import { Pos } from "../lib/Pos";

export type InputPortalPos = {
  start: Pos;
  end: Pos;
}[];

export type InitGameConfig = {
  rowsAmount: number;
  wallData: number[][];
  coinData: number[][];
  superCoinsPos: Pos[];
  pacmanPos: Pos;
  ghostsPos: Pos;
  portalPos: InputPortalPos;
  gameLoopTimeMs: number;
  ghostsDifficultyStages: {
    distFromPacmanForPath: number;
    timeS: number | null;
  }[];
};

export default function getInitGameConfig(): InitGameConfig {
  const createPortalPosObj = (start: Pos, end: Pos) => {
    return { start, end };
  };
  return {
    rowsAmount: 28,
    wallData: [
      // positive - amount of walls, negative - amount of empty fields
      [28],
      [1, -6, 2, -10, 2, -6, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -26, 1],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [-4, 2, -7, 2, -7, 2, -4],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -22, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -1, 2, -4, 8, -4, 2, -1, 3],
      [3, -1, 2, -1, 2, -1, 8, -1, 2, -1, 2, -1, 3],
      [3, -1, 2, -1, 2, -1, 8, -1, 2, -1, 2, -1, 3],
      [-7, 2, -10, 2, -7],
      [3, -1, 8, -1, 2, -1, 8, -1, 3],
      [3, -1, 8, -1, 2, -1, 8, -1, 3],
      [3, -10, 2, -10, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [1, -26, 1],
      [1, -1, 4, -1, 5, -1, 2, -1, 5, -1, 4, -1, 1],
      [1, -1, 4, -1, 5, -1, 2, -1, 5, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -4, 2, -4, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -26, 1],
      [28],
    ],
    coinData: [
      // positive - amount of no-coin fields, negative - amount of coin fields
      [28],
      [1, -6, 2, -10, 2, -6, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -26, 1],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [3, -1, 2, -1, 5, -1, 2, -1, 5, -1, 2, -1, 3],
      [3, -1, 2, -7, 2, -7, 2, -1, 3],
      [3, -1, 5, 1, 8, 1, 5, -1, 3],
      [3, -1, 5, 1, 8, 1, 5, -1, 3],
      [3, -1, 20, -1, 3],
      [3, -1, 5, 1, 8, 1, 5, -1, 3],
      [3, -1, 5, 1, 8, 1, 5, -1, 3],
      [3, -1, 2, 4, 8, 4, 2, -1, 3],
      [3, -1, 2, 1, 2, 1, 8, 1, 2, 1, 2, -1, 3],
      [3, -1, 2, 1, 2, 1, 8, 1, 2, 1, 2, -1, 3],
      [3, -1, 3, 2, 10, 2, 3, -1, 3],
      [3, -1, 8, 1, 2, 1, 8, -1, 3],
      [3, -1, 8, 1, 2, 1, 8, -1, 3],
      [3, -7, 3, 2, 3, -7, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [3, -1, 5, -1, 8, -1, 5, -1, 3],
      [1, -12, 2, -12, 1],
      [1, -1, 4, -1, 5, -1, 2, -1, 5, -1, 4, -1, 1],
      [1, -1, 4, -1, 5, -1, 2, -1, 5, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -4, 2, -4, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -1, 4, -1, 2, -1, 8, -1, 2, -1, 4, -1, 1],
      [1, -26, 1],
      [28],
    ],
    superCoinsPos: [
      new Pos(1, 2),
      new Pos(26, 2),
      new Pos(1, 27),
      new Pos(26, 27),
    ],

    portalPos: [
      createPortalPosObj(new Pos(-1, 8), new Pos(28, 8)),
      createPortalPosObj(new Pos(28, 8), new Pos(-1, 8)),
      createPortalPosObj(new Pos(-1, 17), new Pos(28, 17)),
      createPortalPosObj(new Pos(28, 17), new Pos(-1, 17)),
      // Saved for later tests
      // temp(new Pos(3, 11), new Pos(24, 11)),
      // temp(new Pos(24, 11), new Pos(3, 11)),
      // temp(new Pos(16, 23), new Pos(12, 23)),
      // temp(new Pos(12, 23), new Pos(16, 23)),
    ],
    pacmanPos: new Pos(14, 23.5),
    ghostsPos: new Pos(13.5, 11.5),
    gameLoopTimeMs: 20,
    ghostsDifficultyStages: [
      { distFromPacmanForPath: 30, timeS: 15 },

      { distFromPacmanForPath: 20, timeS: 15 },
      { distFromPacmanForPath: 10, timeS: 15 },
      { distFromPacmanForPath: 5, timeS: 15 },
      { distFromPacmanForPath: 3, timeS: null },
    ],
  };
}

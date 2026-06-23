import type { InputPortalPos } from "../config/gameConfig";
import type { Pos } from "../lib/Pos";
import type { Prettify } from "../lib/Prettify";

export type CoinValue = "NO_COIN" | "COIN" | "SUPER_COIN";

export type ModelState = {
  wallData: boolean[][];
  coinData: CoinValue[][];
  pacmanPos: Pos;
  secondPacmanPos: Pos | null;
  ghosts: Pos[];
  score: number;
  highScore: number;
  lives: number;
  isBlueGhostMode: boolean;
};

export type PortalData = Prettify<InputPortalPos>;

import type { GhostsStagesList } from "../../config/gameConfig";
import { Dir } from "../../lib/Dir";
import { Pos } from "../../lib/Pos";
import type { PortalData } from "../../types/modelTypes";
import Ghost from "./Ghost";
import GhostsStages from "./GhostsStages";
import Model from "./Model";

const MAX_GHOSTS_AMOUNT = 4;

type visitedPathObj = { from: Pos; dirToPortal?: Dir };

type visitedDistObj = { dist: number; dirToPortal?: Dir };

class Ghosts {
  private _ghosts: Ghost[];
  private _stages: GhostsStages;
  private _ghostsSpawnerPos: Pos;
  constructor(
    ghostsSpawnerPos: Pos,
    ghostsStagesList: GhostsStagesList,
    wallData: boolean[][],
    portalData: PortalData,
    pacmanPos: Pos,
  ) {
    this._ghostsSpawnerPos = ghostsSpawnerPos;
    this._stages = new GhostsStages(ghostsStagesList);
    this._ghosts = [];
    this.createNewGhost(pacmanPos, wallData, portalData);
  }

  private createNewGhost(pacmanPos: Pos, wallData: boolean[][], portalData: PortalData) {
    const pos = new Pos(this._ghostsSpawnerPos.x, this._ghostsSpawnerPos.y);
    const path = this.createNewPathForGhost(pos, pacmanPos, wallData, portalData);
    this._ghosts.push(new Ghost(pos, path));
  }

  public createNewPathForGhost(
    ghostPos: Pos,
    pacmanPos: Pos,
    wallData: boolean[][],
    portalData: PortalData,
  ) {
    return this.generatePathToPacman(
      new Pos(Math.floor(ghostPos.x), Math.floor(ghostPos.y)),
      new Pos(Math.floor(pacmanPos.x), Math.floor(pacmanPos.y)),
      wallData,
      portalData,
    );
  }

  private generatePathToPacman(
    ghostPos: Pos,
    pacmanPos: Pos,
    wallData: boolean[][],
    portalData: PortalData,
  ) {
    pacmanPos = this.generateEndPosInDist(
      pacmanPos,
      this._stages.getCurrentMaxDistFromPacmanForPath(),
      wallData,
      portalData,
    );

    const visited = this.createVisitedPathObj(ghostPos, pacmanPos, wallData, portalData);
    const path: Pos[] = [];

    const curr = new Pos(pacmanPos.x, pacmanPos.y);

    path.push(new Pos(pacmanPos.x, pacmanPos.y));

    while (!curr.isEqualTo(ghostPos)) {
      const next = visited[curr.y][curr.x];
      if (next === null) {
        // should not happen
        throw new Error("No path from ghost to pacman found");
      }

      curr.x = next.from.x;
      curr.y = next.from.y;

      if (next.dirToPortal !== undefined) {
        path.push(Pos.addDirToPos(curr, next.dirToPortal));
      }
      if (next.from.isEqualTo(ghostPos)) {
        break;
      }

      path.push(new Pos(curr.x, curr.y));
    }

    path.push(new Pos(ghostPos.x, ghostPos.y));

    path.reverse();
    return path;
  }

  generateEndPosInDist(
    pacmanPos: Pos,
    dist: number,
    wallData: boolean[][],
    portalData: PortalData,
  ) {
    const visited = this.createVisitedDistObj(pacmanPos, dist, wallData, portalData);

    const endPosCandidates: Pos[] = [];
    for (let r = 0; r < visited.length; r++) {
      for (let c = 0; c < visited[r].length; c++) {
        if (visited[r][c] !== null) {
          endPosCandidates.push(new Pos(c, r));
        }
      }
    }

    return endPosCandidates[Math.floor(Math.random() * endPosCandidates.length)];
  }

  createVisitedDistObj(
    pacmanPos: Pos,
    dist: number,
    wallData: boolean[][],
    portalData: PortalData,
  ) {
    const queue = [];
    const visited: (null | visitedDistObj)[][] = wallData.map((row) => row.map(() => null));
    visited[pacmanPos.y][pacmanPos.x] = {
      dist: 0,
    };

    queue.push(new Pos(pacmanPos.x, pacmanPos.y));

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr === undefined) {
        throw new Error("Queue is empty when it shoud not");
      }

      const neighbours = this.createNewNeighboursList(curr, wallData, portalData, visited);
      for (const neighbour of neighbours) {
        const lastDist = visited[curr.y][curr.x]?.dist;
        if (lastDist === undefined) {
          throw new Error("Last step was not marked as visited");
        }
        visited[neighbour.pos.y][neighbour.pos.x] = {
          dist: lastDist + 1,
          dirToPortal: neighbour.dirToPortalStart,
        };

        if (lastDist + 1 < dist) {
          queue.push(neighbour.pos);
        }
      }
    }
    return visited;
  }
  createVisitedPathObj(
    ghostPos: Pos,
    pacmanPos: Pos,
    wallData: boolean[][],
    portalData: PortalData,
  ) {
    const queue = [];

    const visited: (null | visitedPathObj)[][] = wallData.map((row) => row.map(() => null));

    visited[ghostPos.y][ghostPos.x] = {
      from: new Pos(-1, -1),
    };
    queue.push(ghostPos);
    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr === undefined) {
        throw new Error("Queue is empty when it shoud not");
      }

      const neighbours = this.createNewNeighboursList(curr, wallData, portalData, visited);
      for (const neighbour of neighbours) {
        visited[neighbour.pos.y][neighbour.pos.x] = {
          from: new Pos(curr.x, curr.y),
          dirToPortal: neighbour.dirToPortalStart,
        };

        if (neighbour.pos.isEqualTo(pacmanPos)) {
          return visited;
        }

        queue.push(neighbour.pos);
      }
    }

    return visited;
  }

  createNewNeighboursList(
    pos: Pos,
    wallData: boolean[][],
    portalData: PortalData,
    visited: (null | visitedPathObj)[][] | (null | visitedDistObj)[][],
  ) {
    const neighbours: { pos: Pos; dirToPortalStart?: Dir }[] = [
      { pos: new Pos(pos.x + 1, pos.y) },
      { pos: new Pos(pos.x - 1, pos.y) },
      { pos: new Pos(pos.x, pos.y + 1) },
      { pos: new Pos(pos.x, pos.y - 1) },
    ].filter((el) => Model.isPosOutOfBounds(el.pos, wallData) || !wallData[el.pos.y][el.pos.x]);

    for (const neighbour of neighbours) {
      for (let i = 0; i < portalData.length; i++) {
        const { start, end } = portalData[i];
        if (neighbour.pos.isEqualTo(start)) {
          const dir = new Dir(
            (neighbour.pos.x - pos.x) as -1 | 0 | 1,
            (neighbour.pos.y - pos.y) as -1 | 0 | 1,
          );

          neighbour.pos.x = end.x + dir.x;
          neighbour.pos.y = end.y + dir.y;
          neighbour.dirToPortalStart = new Dir(dir.x, dir.y);
        }
      }
    }
    return neighbours.filter(
      (el) => !Model.isPosOutOfBounds(el.pos, wallData) && visited[el.pos.y][el.pos.x] === null,
    );
  }

  public moveGhosts(
    wallData: boolean[][],
    portalData: PortalData,
    pacmanPos: Pos,
    deltaTimeMs: number,
  ) {
    const isNewStage = this._stages.update(deltaTimeMs);
    if (this._ghosts.length < MAX_GHOSTS_AMOUNT && isNewStage) {
      this.createNewGhost(pacmanPos, wallData, portalData);
    }
    for (const ghost of this._ghosts) {
      ghost.move(
        (ghostPos: Pos) => this.createNewPathForGhost(ghostPos, pacmanPos, wallData, portalData),
        portalData,
      );
    }
  }

  resetPosAndStage(wallData: boolean[][], portalData: PortalData, pacmanPos: Pos) {
    this._stages.reset();
    this.resetPos(wallData, portalData, pacmanPos);
  }

  resetPos(wallData: boolean[][], portalData: PortalData, pacmanPos: Pos) {
    for (const ghost of this._ghosts) {
      ghost.reset(this._ghostsSpawnerPos, (ghostPos: Pos) =>
        this.createNewPathForGhost(ghostPos, pacmanPos, wallData, portalData),
      );
    }
  }

  getGhostsPos() {
    return this._ghosts.map((el) => el.getPos());
  }
}

export default Ghosts;

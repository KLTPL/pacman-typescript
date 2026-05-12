import { Dir } from "../../lib/Dir";
import { Pos } from "../../lib/Pos";
import Ghost from "./Ghost";
import type { PortalData } from "./Model";
import Model from "./Model";

type visitedPathObj = { from: Pos; dirToPortal?: Dir };

type visitedDistObj = { dist: number; dirToPortal?: Dir };

class Ghosts {
  _ghosts: Ghost[];
  constructor(wallData: boolean[][], portalData: PortalData, pacmanPos: Pos) {
    this._ghosts = [];
    const positions = [new Pos(13.5, 11.5)];
    for (const pos of positions) {
      const path = this.generatePathToPacman(
        new Pos(Math.floor(pos.x), Math.floor(pos.y)),
        new Pos(Math.floor(pacmanPos.x), Math.floor(pacmanPos.y)),

        wallData,
        portalData,
      );
      this._ghosts.push(new Ghost(pos, path));
    }
  }

  private generatePathToPacman(
    ghostPos: Pos,
    pacmanPos: Pos,
    wallData: boolean[][],
    portalData: PortalData,
  ) {
    pacmanPos = this.generateEndPosInDist(pacmanPos, 5, wallData, portalData);

    const visited = this.createVisitedPathObj(
      ghostPos,
      pacmanPos,
      wallData,
      portalData,
    );
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
    const visited = this.createVisitedDistObj(
      pacmanPos,
      dist,
      wallData,
      portalData,
    );

    const endPosCandidates: Pos[] = [];
    for (let r = 0; r < visited.length; r++) {
      for (let c = 0; c < visited[r].length; c++) {
        if (visited[r][c] !== null) {
          endPosCandidates.push(new Pos(c, r));
        }
      }
    }

    return endPosCandidates[
      Math.floor(Math.random() * endPosCandidates.length)
    ];
  }

  createVisitedDistObj(
    pacmanPos: Pos,
    dist: number,
    wallData: boolean[][],
    portalData: PortalData,
  ) {
    const queue = [];
    const visited: (null | visitedDistObj)[][] = wallData.map((row) =>
      row.map(() => null),
    );
    visited[pacmanPos.y][pacmanPos.x] = {
      dist: 0,
    };

    queue.push(new Pos(pacmanPos.x, pacmanPos.y));

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr === undefined) {
        throw new Error("Queue is empty when it shoud not");
      }

      const neighbours = this.createNewNeighboursList(
        curr,
        wallData,
        portalData,
        visited,
      );
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

    const visited: (null | visitedPathObj)[][] = wallData.map((row) =>
      row.map(() => null),
    );

    visited[ghostPos.y][ghostPos.x] = {
      from: new Pos(-1, -1),
    };
    queue.push(ghostPos);
    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr === undefined) {
        throw new Error("Queue is empty when it shoud not");
      }

      const neighbours = this.createNewNeighboursList(
        curr,
        wallData,
        portalData,
        visited,
      );
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
    ].filter(
      (el) =>
        Model.isPosOutOfBounds(el.pos, wallData) ||
        !wallData[el.pos.y][el.pos.x],
    );

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
      (el) =>
        !Model.isPosOutOfBounds(el.pos, wallData) &&
        visited[el.pos.y][el.pos.x] === null,
    );
  }

  public moveGhosts(
    wallData: boolean[][],
    portalData: PortalData,
    pacmanPos: Pos,
  ) {
    const createNewPath = (ghostPos: Pos) => {
      const path = this.generatePathToPacman(
        new Pos(Math.floor(ghostPos.x), Math.floor(ghostPos.y)),

        new Pos(Math.floor(pacmanPos.x), Math.floor(pacmanPos.y)),

        wallData,
        portalData,
      );

      return path;
    };
    for (const ghost of this._ghosts) {
      ghost.move(createNewPath, portalData);
    }
  }

  getGhostsPos() {
    return this._ghosts.map((el) => el.getPos());
  }
}

export default Ghosts;

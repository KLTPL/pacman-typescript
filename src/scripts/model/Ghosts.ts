import { Dir } from "../../lib/Dir";
import { Pos } from "../../lib/Pos";
import Ghost from "./Ghost";
import type { PortalData } from "./Model";

class Ghosts {
  _ghosts: Ghost[];
  constructor(wallData: boolean[][], portalData: PortalData, pacmanPos: Pos) {

    console.log(pacmanPos)
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
    const visited = this.createVisitedObj(
      ghostPos,
      pacmanPos,
      wallData,
      portalData,
    );
    console.log(pacmanPos)
    const path: Pos[] = [];

    const curr = new Pos(pacmanPos.x, pacmanPos.y);

    path.push(new Pos(pacmanPos.x, pacmanPos.y));
    console.log("GHOST POS:", JSON.stringify(ghostPos))
    while (!curr.isEqualTo(ghostPos)) {
      const next = visited[curr.y][curr.x];
      if (next === null) { // should not happen
        throw new Error("No path from ghost to pacman found");
      }

      curr.x = next.x;
      curr.y = next.y;

      if (next.isEqualTo(ghostPos)) {
        break;

      }
      path.push(new Pos(curr.x, curr.y));

      console.log("ADD TO PATH", JSON.stringify(curr))
    }

    path.push(new Pos(ghostPos.x, ghostPos.y));

    path.reverse();
    return path;
  }

  createVisitedObj(
    ghostPos: Pos,
    pacmanPos: Pos,
    wallData: boolean[][],
    portalData: PortalData,
  ) {
    const queue = [];
    const visited: (null | Pos)[][] = wallData.map(row => row.map(() => null));


    visited[ghostPos.y][ghostPos.x] = new Pos(-1, -1);
    queue.push(ghostPos);
    let n = 1;
    while (queue.length > 0) {
      n++;
      const curr = queue.shift();
      if (curr === undefined) {
        throw new Error("Queue is empty when it shoud not");
      }

      const neighbours: Pos[] = this.createNewNeighboursList(curr, wallData, portalData, visited);
      for (const neighbour of neighbours) {
        visited[neighbour.y][neighbour.x] = new Pos(curr.x, curr.y);

        if (neighbour.isEqualTo(pacmanPos)) {
          return visited;
        }

        queue.push(neighbour);
      }
    }

    return visited;
  }

  createNewNeighboursList(
    pos: Pos,
    wallData: boolean[][],
    portalData: PortalData,
    visited: (null | Pos)[][]
  ) {
    const isOutOfBounds = (el: Pos) => (wallData[el.y] === undefined || wallData[el.y][el.x] === undefined);

    const neighbours = [
      new Pos(pos.x + 1, pos.y),
      new Pos(pos.x - 1, pos.y),
      new Pos(pos.x, pos.y + 1),
      new Pos(pos.x, pos.y - 1)
    ]
      .filter((el) =>
        isOutOfBounds(el) ||
        !wallData[el.y][el.x]
      );

    for (const neighbour of neighbours) {
      for (let i = 0; i < portalData.length; i++) {
        const { start, end } = portalData[i];
        if (neighbour.isEqualTo(start)) {
          const dir = new Dir(neighbour.x - pos.x as -1 | 0 | 1, neighbour.y - pos.y as -1 | 0 | 1);

          neighbour.x = end.x + dir.x;
          neighbour.y = end.y + dir.y;
        }


      }
    }
    return neighbours.filter(el => !isOutOfBounds(el) && visited[el.y][el.x] === null);
  }

  public moveGhosts(wallData: boolean[][], portalData: PortalData, pacmanPos: Pos) {
    const createNewPath = (ghostPos: Pos) => {
      console.log("GHOST POS BEFORE:", ghostPos)
      const path = this.generatePathToPacman(

        new Pos(Math.floor(ghostPos.x), Math.floor(ghostPos.y)),
        new Pos(Math.floor(pacmanPos.x), Math.floor(pacmanPos.y)),

        wallData,
        portalData,
      );
      console.log("NEW PATH:")
      console.log(JSON.stringify(path))

      return path;
    }
    for (const ghost of this._ghosts) {

      ghost.move(createNewPath);
    }
  }

  getGhostsPos() {
    return this._ghosts.map(el => el.getPos());
  }
}

export default Ghosts;

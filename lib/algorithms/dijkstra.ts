import EventDispatcher from "../event-dispatcher/event-dispatcher";
import { Edge } from "../structs/Edge";
import { Graph } from "../structs/Graph";
import { Vertex } from "../structs/Vertex";

export class Dijkstra extends EventDispatcher {
  public static getPath(
    vertex: Vertex,
    previous: Map<Vertex, Vertex | null>
  ): Vertex[] {
    const path: Vertex[] = [];
    let currentVertex: Vertex | null = vertex;
    while (currentVertex !== null) {
      path.push(currentVertex);
      currentVertex = previous.get(currentVertex) ?? null;
    }
    return path.reverse();
  }

  public async dijkstra(
    graph: Graph,
    sourceVertex?: Vertex
  ): Promise<{
    distances: Map<Vertex, number>;
    previous: Map<Vertex, Vertex | null>;
  }> {
    // check if all vertices have a weight, and greater than 0
    for (const edge of graph.getEdges()) {
      if (edge.Weight === undefined || edge.Weight <= 0) {
        throw new Error(`Invalid edge weight: ${edge.Weight}`);
      }
    }

    const distances: Map<Vertex, number> = new Map();
    const unvisited: Set<Vertex> = new Set(graph.getVertices());
    const visited: Set<Vertex> = new Set();
    const previous: Map<Vertex, Vertex | null> = new Map();

    // Initialize distances
    for (const vertex of graph.getVertices()) {
      distances.set(vertex, Infinity);
      previous.set(vertex, null);
    }

    this.emit("init", distances);

    if (sourceVertex === undefined) {
      sourceVertex = await this.emitBlocking(
        "selectVertex",
        graph.getVertex(0)
      );
    }

    distances.set(sourceVertex, 0);

    while (unvisited.size !== 0) {
      let currentVertex: Vertex | null = null;
      let smallestDistance = Infinity;

      unvisited.forEach((vertex) => {
        const dist = distances.get(vertex) ?? Infinity;
        if (dist < smallestDistance) {
          smallestDistance = dist;
          currentVertex = vertex;
        }
      });

      if (sourceVertex !== currentVertex) {
        await this.emitBlocking("takeClosestVertex", null, {
          current: currentVertex,
          unvisited: unvisited,
          visited: visited,
          distances: distances,
          previous: previous,
        });
      }

      if (currentVertex === null) {
        break;
      }

      unvisited.delete(currentVertex);
      visited.add(currentVertex);

      await this.emitBlocking("lockVertex", null, {
        current: currentVertex,
        unvisited: unvisited,
        visited: visited,
        distances: distances,
        previous: previous,
      });

      const neighbors = graph.getAdjacentVertices(currentVertex);
      const adjVerticesUnvisited = [];
      const recap: Map<Vertex, any> = new Map();
      for (const neighbor of neighbors) {
        if (unvisited.has(neighbor)) {
          adjVerticesUnvisited.push(neighbor);
          const edges = graph.getEdgesFromVertices(currentVertex, neighbor);
          const minEdge = edges.reduce((prev, curr) =>
            prev.Weight < curr.Weight ? prev : curr
          );
          const alt = distances.get(currentVertex) + minEdge.Weight!;
          if (alt < distances.get(neighbor)) {
            recap.set(neighbor, {
              upgrade: true,
              edge: minEdge,
              newDistance: alt,
              previousDistance: distances.get(neighbor),
            });
            distances.set(neighbor, alt);
            previous.set(neighbor, currentVertex);
          } else {
            recap.set(neighbor, { upgrade: false, newDistance: alt });
          }
        }
      }
      await this.emitBlocking("adjacentVerticesUnvisited", null, {
        adjVerticesUnvisited,
        visited,
        current: currentVertex,
      });
      await this.emitBlocking("verticesUpdates", null, {
        recap,
        adjVerticesUnvisited,
        visited,
        currentVertex,
        distances,
      });
    }

    await this.emitBlocking("finish", null, {
      unvisited: unvisited,
      visited: visited,
      distances: distances,
      previous: previous,
    });

    return { distances, previous };
  }
}

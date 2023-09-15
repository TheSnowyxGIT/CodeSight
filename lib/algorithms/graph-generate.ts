import EventDispatcher from "../event-dispatcher/event-dispatcher";
import { Graph, UndirectedGraph } from "../structs/Graph";

export class GraphGenerator extends EventDispatcher {
  public async basicGenerate(vertices: number, edges: number): Promise<Graph> {
    const graph = new UndirectedGraph(vertices);
    let i = 0;
    while (i < edges) {
      const a = graph.getVertex(Math.floor(Math.random() * vertices));
      const b = graph.getVertex(Math.floor(Math.random() * vertices));
      if (!graph.hasEdge(a, b) && a.Id !== b.Id) {
        graph.addEdge(a, b);
        i++;
      }
    }
    return graph;
  }

  public async regularGenerate(
    vertices: number,
    degree: number
  ): Promise<Graph> {
    const graph = new UndirectedGraph(vertices);

    for (let i = 0; i < vertices; i++) {
      const vertexI = graph.getVertex(i);
      let j = 0;
      while (graph.getDegree(vertexI) < degree && j < vertices) {
        const vertexJ = graph.getVertex(j);
        if (
          vertexI.Id !== vertexJ.Id &&
          !graph.hasEdge(vertexI, vertexJ) &&
          graph.getDegree(vertexJ) < degree
        ) {
          graph.addEdge(vertexI, vertexJ);
        }
        j += 1;
      }
    }

    return graph;
  }

  public async completeGenerate(vertices: number): Promise<Graph> {
    const graph = new UndirectedGraph(vertices);

    for (let i = 0; i < vertices; i++) {
      for (let j = i + 1; j < vertices; j++) {
        const vertexA = graph.getVertex(i);
        const vertexB = graph.getVertex(j);
        graph.addEdge(vertexA, vertexB);
      }
    }

    return graph;
  }
}

import { GraphRendererTask } from "../renderers/graph.renderer.task";
import { Drawable } from "../tasks/render.task";
import { Edge } from "./Edge";
import { Vertex } from "./Vertex";

export abstract class Graph extends Drawable<GraphRendererTask> {
  private vertices: Vertex[] = [];
  private edges: Edge[] = [];
  private directed: boolean;

  public getEdges(): Edge[] {
    return this.edges;
  }
  public getVertices(): Vertex[] {
    return this.vertices;
  }
  public getVerticesNumber(): number {
    return this.vertices.length;
  }

  public isDirected(): boolean {
    return this.directed;
  }

  constructor(verticesNumber: number, directed: boolean) {
    super();
    this.vertices = [];
    this.edges = [];
    this.directed = directed;
    for (let i = 0; i < verticesNumber; i++) {
      const vertex = new Vertex(i);
      this.vertices.push(vertex);
    }
  }

  public getVertex(id: number): Vertex {
    if (id < 0 || id >= this.getVerticesNumber()) {
      throw new Error(`Invalid vertex id: ${id}`);
    }
    return this.vertices[id];
  }

  public addEdge(a: Vertex, b: Vertex): void {
    if (a.Id < 0 || a.Id >= this.getVerticesNumber()) {
      throw new Error(`Invalid a vertex: ${a}`);
    }
    if (b.Id < 0 || b.Id >= this.getVerticesNumber()) {
      throw new Error(`Invalid b vertex: ${b}`);
    }
    const edge = new Edge(a, b, this.isDirected());
    this.edges.push(edge);
  }

  public getAdjacentVertices(vertex: Vertex): Set<Vertex> {
    if (vertex.Id < 0 || vertex.Id >= this.getVerticesNumber()) {
      throw new Error(`Invalid vertex: ${vertex}`);
    }
    const adjacentVertices: Set<Vertex> = new Set<Vertex>();
    for (const edge of this.getEdges()) {
      if (edge.A.Id === vertex.Id) {
        adjacentVertices.add(edge.B);
      } else if (!this.isDirected() && edge.B.Id === vertex.Id) {
        adjacentVertices.add(edge.A);
      }
    }
    return adjacentVertices;
  }

  public getEdgesFromVertex(vertex: Vertex): Edge[] {
    if (vertex.Id < 0 || vertex.Id >= this.getVerticesNumber()) {
      throw new Error(`Invalid vertex: ${vertex}`);
    }
    const edges: Edge[] = [];
    for (const edge of this.getEdges()) {
      if (edge.A.Id === vertex.Id) {
        edges.push(edge);
      } else if (!this.isDirected() && edge.B.Id === vertex.Id) {
        edges.push(edge);
      }
    }
    return edges;
  }

  public getDegree(vertex: Vertex): number {
    return this.getAdjacentVertices(vertex).size;
  }
  public hasEdge(a: Vertex, b: Vertex): boolean {
    const vertices = this.getAdjacentVertices(a);
    return vertices.has(b);
  }

  protected defaultRenderTask(): GraphRendererTask {
    return new GraphRendererTask(this);
  }

  public clearEdges(): void {
    this.edges = [];
  }
}

export class DirectedGraph extends Graph {
  constructor(verticesNumber: number) {
    super(verticesNumber, true);
  }
}

export class UndirectedGraph extends Graph {
  constructor(verticesNumber: number) {
    super(verticesNumber, false);
  }
}

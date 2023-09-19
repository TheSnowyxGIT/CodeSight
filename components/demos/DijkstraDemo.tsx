"use client";
import React, { Component, ReactElement, RefObject, createRef } from "react";
import P5Sketch from "../p5/sketch.component";
import MovingPoint from "@/lib/MovingPoint";
import type p5 from "p5";
import { Box, Circle, Point } from "js-quadtree";
import QuadTree from "@/lib/structs/QuadTree";
import { TaskRunner } from "@/lib/tasks/task.runner";
import { Graph } from "@/lib/structs/Graph";
import { GraphGenerator } from "@/lib/algorithms/graph-generate";
import { FruchReinRenderTask } from "@/lib/renderers/frunchRein.renderer.task";
import { Dijkstra } from "@/lib/algorithms/dijkstra";
import { EventType } from "@/lib/event-dispatcher";
import { Vertex } from "@/lib/structs/Vertex";
import {
  BasicEdgeRenderer,
  EdgeRendererTask,
} from "@/lib/renderers/edge.renderer.task";
import { Edge } from "@/lib/structs/Edge";
import {
  BasicVertexRendererTask,
  BlinkVertexRendererTask,
  VertexRendererTask,
} from "@/lib/renderers/vertex.renderer.task";

export interface DijkstraDemoProps {
  className?: string;
  onNewBox?: (children: ReactElement) => void;
  onNeedNext?: (value: boolean) => void;
}

export default class DijkstraDemo extends Component<DijkstraDemoProps> {
  private graph: Graph;
  private visited: Set<Vertex>;
  private taskRunner: TaskRunner;
  private fruchReinTask: FruchReinRenderTask;
  private p5Sketch: RefObject<P5Sketch>;

  constructor(props: DijkstraDemoProps) {
    super(props);
    this.taskRunner = new TaskRunner();
    this.p5Sketch = createRef();
  }

  private nextPromise: Promise<any>;
  private nextResolve: () => void;
  public next() {
    this.nextResolve();
  }
  private async waitNext() {
    this.nextPromise = new Promise<void>((resolve) => {
      this.nextResolve = resolve;
    });
    await this.nextPromise;
  }

  private edgeRenderTask(edge: Edge, color = "gray"): EdgeRendererTask {
    const task = new BasicEdgeRenderer(edge);
    task.setOptions({
      color: color,
      edgeWeight: 0.2,
      showWeight: true,
    });
    return task;
  }

  private vertexRenderTask(
    vertex: Vertex,
    color = "black"
  ): VertexRendererTask {
    const task = new BasicVertexRendererTask(vertex);
    task.setOptions({
      color: color,
      radius: 3,
      glowRadius: [],
      showTag: true,
    });
    return task;
  }

  private vertexHoverRenderTask(vertex: Vertex): VertexRendererTask {
    const task = new BasicVertexRendererTask(vertex);
    task.setOptions({
      color: "black",
      radius: 4,
      glowRadius: [10, 20],
      glowColor: "while",
      showTag: true,
    });
    return task;
  }

  private vertexHighlightRenderTask(
    vertex: Vertex,
    blinkColor: string = "red"
  ): VertexRendererTask {
    const task = new BlinkVertexRendererTask(vertex);
    task.setOptions({
      color: "black",
      radius: 3,
      showTag: true,
      speed: 0.003,
      blinkColor,
    });
    return task;
  }

  private _setBox: (children: ReactElement) => void;
  private setBox(children: ReactElement) {
    if (this._setBox) {
      return this._setBox(children);
    }
    let count = 0;
    this._setBox = (children: ReactElement) => {
      this.props.onNewBox(
        <>
          <strong>{count + 1}.</strong> {children}
        </>
      );
      count += 1;
    };
    this._setBox(children);
  }

  async componentDidMount(): Promise<void> {
    const graphGenerator = new GraphGenerator();
    this.graph = await graphGenerator.basicGenerate(8, 10);
    this.graph.RenderTask.options.padding = 4;
    for (const edge of this.graph.getEdges()) {
      edge.setRenderTask(this.edgeRenderTask(edge));
    }
    for (const vertex of this.graph.getVertices()) {
      vertex.setRenderTask(this.vertexRenderTask(vertex));
    }

    await graphGenerator.applyWeights(this.graph, 1, 10);
    this.fruchReinTask = new FruchReinRenderTask(this.graph);
    this.fruchReinTask.options.l = 15;
    // wait p5 to be loaded
    await this.p5Sketch.current?.loaded;
    await this.taskRunner.startTask(this.fruchReinTask, {
      dc: this.p5Sketch.current.dc,
    });
    const dijkstra = new Dijkstra();
    dijkstra.addSubscriber(this.onEvent.bind(this));
    dijkstra.dijkstra(this.graph);
  }

  private async onEvent(
    type: "blocking" | "noBlocking",
    value: EventType,
    payload: any
  ): Promise<any> {
    if (value === "selectVertex") {
      return await this.selectVertex(payload);
    } else if (value === "takeClosestVertex") {
      return await this.takeClosestVertex(payload);
    } else if (value === "lockVertex") {
      return await this.lockVertex(payload);
    } else if (value === "adjacentVerticesUnvisited") {
      return await this.adjacentVerticesUnvisited(payload);
    } else if (value === "verticesUpdates") {
      return await this.verticesUpdates(payload);
    } else if (value === "finish") {
      return await this.finish(payload);
    }
  }

  private async selectVertex(payload: any): Promise<Vertex> {
    // Info box setup
    this.setBox(
      <>
        Select a <strong>vertex</strong> to start Dijkstra algorithm.
      </>
    );

    let vertex: Vertex;
    this.fruchReinTask.options.onlyManualStop = true;
    for (const vertex of this.graph.getVertices()) {
      vertex.RenderTask.options.hoverTask = this.vertexHoverRenderTask(vertex);
      vertex.RenderTask.options.pressTask = this.vertexHoverRenderTask(vertex);
    }
    this.fruchReinTask.on("vertexClicked", (clickedVertex: Vertex) => {
      vertex = clickedVertex;
      this.fruchReinTask.stop();
    });
    await this.taskRunner.startTask(this.fruchReinTask, {
      dc: this.p5Sketch.current.dc,
    });
    this.fruchReinTask.removeAllListeners("vertexClicked");
    for (const vertex of this.graph.getVertices()) {
      vertex.RenderTask.options.hoverTask = null;
      vertex.RenderTask.options.pressTask = null;
    }

    // Info box setup
    this.setBox(
      <>
        You have chosen to start the algorithm from the vertex{" "}
        <strong>{vertex.tag()}</strong>
      </>
    );
    this.props.onNeedNext(true);
    vertex.setRenderTask(this.vertexRenderTask(vertex, "green"));
    this.waitNext().then(() => {
      this.fruchReinTask.stop();
    });
    await this.taskRunner.startTask(this.fruchReinTask, {
      dc: this.p5Sketch.current.dc,
    });

    return vertex;
  }

  private async takeClosestVertex(payload: any) {
    const { current, unvisited, distances, visited } = payload;
    this.setBox(
      <>
        Now we search for the vertex with the shortest distance from the in the
        distance map. <br />
      </>
    );
    this.visited = visited;
    this.fruchReinTask.options.onlyManualStop = true;
    for (const vertex of unvisited) {
      vertex.setRenderTask(this.vertexHighlightRenderTask(vertex));
    }
    for (const vertex of visited) {
      vertex.setRenderTask(this.vertexRenderTask(vertex, "gray"));
    }
    this.waitNext().then(() => {
      this.fruchReinTask.stop();
    });
    await this.taskRunner.startTask(this.fruchReinTask, {
      dc: this.p5Sketch.current.dc,
    });
    for (const vertex of unvisited) {
      vertex.setRenderTask(this.vertexRenderTask(vertex));
    }
    this.setBox(
      <>
        The vertex with the shortest distance is{" "}
        <strong>{current.tag()}</strong> with a distance of{" "}
        <strong>{distances.get(current)}</strong>.
      </>
    );
    (current as Vertex).setRenderTask(this.vertexRenderTask(current, "green"));
    this.waitNext().then(() => {
      this.fruchReinTask.stop();
    });
    await this.taskRunner.startTask(this.fruchReinTask, {
      dc: this.p5Sketch.current.dc,
    });
    (current as Vertex).setRenderTask(this.vertexRenderTask(current));
  }

  private async lockVertex(payload: any) {
    const { current, unvisited, previous, distances } = payload;
    // Info box setup
    const path = Dijkstra.getPath(current, previous);
    if (path.length === 1) {
      return;
    }

    this.setBox(
      <>
        Now we mark the vertex <strong>{current.tag()}</strong> as visited.{" "}
        <br />
        <br />
        The shortest path to this vertex <strong>{current.tag()}</strong>, with
        a distance of <strong>{distances.get(current)}</strong>, is :{" "}
        {path.map((vertex) => vertex.tag()).join(" -> ")}
      </>
    );
    this.fruchReinTask.options.onlyManualStop = true;
    (current as Vertex).setRenderTask(this.vertexRenderTask(current, "green"));
    this.waitNext().then(() => {
      this.fruchReinTask.stop();
    });
    await this.taskRunner.startTask(this.fruchReinTask, {
      dc: this.p5Sketch.current.dc,
    });
    (current as Vertex).setRenderTask(this.vertexRenderTask(current));
  }

  private async adjacentVerticesUnvisited(payload: any) {
    const { adjVerticesUnvisited, visited, current } = payload;
    // Info box setup
    if (adjVerticesUnvisited.length === 0) {
      this.setBox(
        <>
          There is no <strong>unvisited adjacent</strong> vertices of the vertex{" "}
          <strong>{current.tag()}</strong>. So we can skip this step.
        </>
      );
    } else {
      this.setBox(
        <>
          The following vertices are <strong>unvisited adjacent</strong>{" "}
          vertices of the vertex <strong>{current.tag()}</strong>:
          <ul>
            {adjVerticesUnvisited.map((vertex: Vertex) => (
              <li key={vertex.tag()}>{vertex.tag()}</li>
            ))}
          </ul>
          For each of these vertices, we will check if the distance to them from
          the vertex <strong>{current.tag()}</strong> is shorter than the
          distance we already have.
        </>
      );
    }
    this.fruchReinTask.options.onlyManualStop = true;
    for (const vertex of adjVerticesUnvisited) {
      this.graph.getEdgesFromVertices(current, vertex).forEach((edge) => {
        edge.setRenderTask(this.edgeRenderTask(edge, "green"));
      });
      vertex.setRenderTask(this.vertexHighlightRenderTask(vertex, "green"));
    }
    for (const vertex of visited) {
      vertex.setRenderTask(this.vertexRenderTask(vertex, "gray"));
    }
    (current as Vertex).setRenderTask(this.vertexRenderTask(current, "green"));
    this.waitNext().then(() => {
      this.fruchReinTask.stop();
    });
    await this.taskRunner.startTask(this.fruchReinTask, {
      dc: this.p5Sketch.current.dc,
    });
    (current as Vertex).setRenderTask(this.vertexRenderTask(current));

    for (const vertex of adjVerticesUnvisited) {
      this.graph.getEdgesFromVertices(current, vertex).forEach((edge) => {
        edge.setRenderTask(this.edgeRenderTask(edge));
      });
      vertex.setRenderTask(this.vertexRenderTask(vertex));
    }
  }

  private async verticesUpdates(payload: any) {
    const {
      recap,
      currentVertex,
      distances,
      adjVerticesUnvisited,
      newDistance,
    } = payload;

    if (adjVerticesUnvisited.length === 0) {
      return;
    }
    for (const adjVertex of adjVerticesUnvisited) {
      const { upgrade, edge, newDistance, previousDistance } = (
        recap as Map<Vertex, any>
      ).get(adjVertex);
      if (upgrade) {
        this.setBox(
          <>
            For the vertex <strong>{adjVertex.tag()}</strong>, the path using
            the vertex <strong>{currentVertex.tag()}</strong> is shorter than
            the path we already have: <br />
            <br />
            <strong>{newDistance}</strong> &lt; {previousDistance}
          </>
        );
      } else {
        this.setBox(
          <>
            For the vertex <strong>{adjVertex.tag()}</strong>, the path using
            the vertex <strong>{currentVertex.tag()}</strong> is not shorter
            than the path we already have: <br />
            <br />
            <strong>{newDistance}</strong> &gt; {distances.get(adjVertex)}
          </>
        );
      }
      adjVertex.setRenderTask(this.vertexRenderTask(adjVertex, "blue"));
      currentVertex.setRenderTask(
        this.vertexRenderTask(currentVertex, "green")
      );
      this.graph
        .getEdgesFromVertices(currentVertex, adjVertex)
        .forEach((edge) => {
          edge.setRenderTask(this.edgeRenderTask(edge, "blue"));
        });
      this.waitNext().then(() => {
        this.fruchReinTask.stop();
      });
      await this.taskRunner.startTask(this.fruchReinTask, {
        dc: this.p5Sketch.current.dc,
      });
      adjVertex.setRenderTask(this.vertexRenderTask(adjVertex));
      currentVertex.setRenderTask(this.vertexRenderTask(currentVertex));
      this.graph
        .getEdgesFromVertices(currentVertex, adjVertex)
        .forEach((edge) => {
          edge.setRenderTask(this.edgeRenderTask(edge));
        });
    }
  }

  private async finish(payload: any) {}

  private setup = (p5: p5) => {};

  private draw = (p5: p5) => {
    this.taskRunner.run();
  };

  private windowResized = (p5: p5) => {};

  render() {
    return (
      <P5Sketch
        ref={this.p5Sketch}
        className={this.props.className}
        responsive
        setup={this.setup}
        draw={this.draw}
        windowResized={this.windowResized}
      />
    );
  }
}

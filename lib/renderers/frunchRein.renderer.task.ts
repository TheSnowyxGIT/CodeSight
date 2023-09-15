import p5 from "p5";
import EventDispatcher from "../event-dispatcher/event-dispatcher";
import { Graph, UndirectedGraph } from "../structs/Graph";
import { Vertex } from "../structs/Vertex";
import { RenderTask, RenderTaskOptions } from "../tasks/render.task";
import { PrepareData, TaskOption } from "../tasks/Task";
import { GraphRendererTask } from "./graph.renderer.task";

export interface FruchReinRendererOptions {
  animated: boolean;
  C_rep: number;
  C_spring: number;
  l: number;
}
export class FruchReinRenderTask extends RenderTask<FruchReinRendererOptions> {
  protected defaultOptions(): TaskOption<FruchReinRenderTask> {
    return {
      animated: true,
      C_rep: 2,
      C_spring: 1,
      l: 3,
    };
  }
  constructor(private graph: Graph) {
    super();
    this.verticesPositions = [];
    this.resetPositions();
  }

  public changeGraph(graph: Graph): void {
    this.graph = graph;
    this.resetPositions();
  }

  public resetPositions(): void {
    this.verticesPositions = [];
    for (let i = 0; i < this.graph.getVerticesNumber(); i++) {
      const vector = new p5.Vector();
      vector.x = Math.random() * 40 - 20;
      vector.y = Math.random() * 40 - 20;
      this.verticesPositions.push(vector);
    }
  }

  private verticesPositions: p5.Vector[];

  private maxIterations: number = 200;
  private thresholdForce: number = 0.01;
  private iterations: number = 0;

  private calculateRepulsiveForce(u: Vertex, v: Vertex): p5.Vector {
    const uCoordinates = this.verticesPositions[u.Id];
    const vCoordinates = this.verticesPositions[v.Id];
    const direction = p5.Vector.sub(uCoordinates, vCoordinates).normalize();
    const distance = uCoordinates.dist(vCoordinates);
    const force = direction.mult(this.options.C_rep / distance ** 2);
    return force;
  }

  private calculateAttractiveForce(u: Vertex, v: Vertex): p5.Vector {
    const uCoordinates = this.verticesPositions[u.Id];
    const vCoordinates = this.verticesPositions[v.Id];
    const direction = p5.Vector.sub(vCoordinates, uCoordinates).normalize();
    const distance = uCoordinates.dist(vCoordinates);
    const length =
      Math.log10(distance / this.options.l) * this.options.C_spring;
    return direction.mult(length);
  }

  private calculateForce(u: Vertex): p5.Vector {
    let repulsiveForces: p5.Vector = new p5.Vector(0, 0);
    for (const v of this.graph.getVertices()) {
      if (u.Id === v.Id) {
        continue;
      }
      const repulsiveForce = this.calculateRepulsiveForce(u, v);
      repulsiveForces.add(repulsiveForce);
    }
    let attractiveForces: p5.Vector = new p5.Vector(0, 0);
    for (const v of this.graph.getAdjacentVertices(u)) {
      if (u.Id === v.Id) {
        continue;
      }
      const attractiveForce = this.calculateAttractiveForce(u, v);
      attractiveForces.add(attractiveForce);
    }
    return repulsiveForces.add(attractiveForces);
  }

  private calculateForces(): p5.Vector[] {
    let forces: p5.Vector[] = [];
    for (const vertex of this.graph.getVertices()) {
      // calculate repulsive forces and attractive forces
      const force = this.calculateForce(vertex);
      forces.push(force);
    }
    return forces;
  }

  private coolingFactorFunction(iteration: number): number {
    return 1 ** iteration;
  }
  processOneStep(): number {
    const forces = this.calculateForces();
    for (const vertex of this.graph.getVertices()) {
      // calculate new coordinates
      const coolingForce = forces[vertex.Id].mult(
        this.coolingFactorFunction(this.iterations)
      );
      this.verticesPositions[vertex.Id].add(coolingForce);
    }
    this.iterations++;
    let maxForceMagnitude = this.calculateForces().reduce(
      (max, force) => (max < force.mag() ? force.mag() : max),
      0
    );
    return maxForceMagnitude;
  }

  async processAllSteps(): Promise<p5.Vector[]> {
    this.iterations = 0;
    let maxForceMagnitude;
    do {
      maxForceMagnitude = this.processOneStep();
    } while (
      maxForceMagnitude > this.thresholdForce &&
      this.iterations < this.maxIterations
    );
    return this.verticesPositions;
  }

  prepare(data: PrepareData<RenderTask>): FruchReinRenderTask {
    super.prepare(data);
    this.graph.RenderTask.prepare({
      dc: data.dc,
      verticesPositions: this.verticesPositions,
    });
    this.iterations = 0;
    return this;
  }

  public onRun(): void {
    const forces = this.calculateForces();
    let maxForceMagnitude = forces.reduce(
      (max, force) => (max < force.mag() ? force.mag() : max),
      0
    );
    if (
      maxForceMagnitude < this.thresholdForce ||
      this.iterations > this.maxIterations
    ) {
      this.graph.RenderTask.run();
      if (this.graph.RenderTask.isFinished()) {
        this.done();
      }
      return;
    }
    if (this.options.animated) {
      this.processOneStep();
    } else {
      this.processAllSteps();
    }
    this.graph.RenderTask.run();
  }

  mouseHovered(): boolean {
    return false;
  }

  prepareHoverTask(hoverTask: RenderTask<object>): RenderTask<object> {
    throw new Error("Method not implemented.");
  }
  preparePressTask(hoverTask: RenderTask<object>): RenderTask<object> {
    throw new Error("Method not implemented.");
  }
}

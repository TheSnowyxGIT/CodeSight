import * as p5 from "p5";
import { RenderTask, RenderTaskOptions } from "../tasks/render.task";
import { Graph } from "../structs/Graph";
import { MergePrepareData, PrepareData } from "../tasks/Task";
import { Rectangle } from "../tasks/DrawingContext";

export interface GraphRendererOptions {}
export interface GraphRendererTaskPrepareData {
  verticesPositions: p5.Vector[];
}
export class GraphRendererTask extends RenderTask<GraphRendererOptions> {
  mouseHovered(): boolean {
    return false;
  }
  protected defaultOptions(): RenderTaskOptions {
    return {};
  }
  protected verticesPositions: p5.Vector[];

  constructor(protected graph: Graph) {
    super();
    this.verticesPositions = [];
  }

  prepare(
    data: MergePrepareData<GraphRendererTaskPrepareData, RenderTask>
  ): GraphRendererTask {
    super.prepare(data);
    this.verticesPositions = data.verticesPositions;

    for (const edge of this.graph.getEdges()) {
      edge.RenderTask.prepare({
        dc: this.dc,
        verticesPositions: this.verticesPositions,
      });
    }

    for (const vertex of this.graph.getVertices()) {
      vertex.RenderTask.prepare({
        dc: this.dc,
        verticesPositions: this.verticesPositions,
      });
    }

    return this;
  }

  public onRun(): void {
    this.dc.canvas.clear();
    const bounds = Rectangle.fromPoints(this.verticesPositions);
    this.dc.goTo(bounds.addSpace(1));

    let allFinished = true;
    for (const edge of this.graph.getEdges()) {
      edge.RenderTask.run();
      allFinished = allFinished && edge.RenderTask.isFinished();
    }

    for (const vertex of this.graph.getVertices()) {
      vertex.RenderTask.run();
      allFinished = allFinished && vertex.RenderTask.isFinished();
    }

    if (allFinished) {
      this.done();
    }
  }

  prepareHoverTask(hoverTask: GraphRendererTask): GraphRendererTask {
    return hoverTask.prepare({
      dc: this.dc,
      verticesPositions: this.verticesPositions,
    });
  }

  preparePressTask(hoverTask: GraphRendererTask): GraphRendererTask {
    return hoverTask.prepare({
      dc: this.dc,
      verticesPositions: this.verticesPositions,
    });
  }
}

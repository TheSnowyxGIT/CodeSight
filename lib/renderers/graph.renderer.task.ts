import { RenderTask, RenderTaskOptions } from "../tasks/render.task";
import { Graph } from "../structs/Graph";
import { MergePrepareData, PrepareData, TaskOption } from "../tasks/Task";
import { Rectangle } from "../tasks/DrawingContext";
import Vector from "../structs/Vector";

export interface GraphRendererOptions {
  padding: number;
}
export interface GraphRendererTaskPrepareData {
  verticesPositions: Vector[];
}
export class GraphRendererTask extends RenderTask<GraphRendererOptions> {
  mouseHovered(): boolean {
    return false;
  }
  protected defaultOptions(): TaskOption<GraphRendererTask> {
    return {
      padding: 1,
    };
  }
  protected verticesPositions: Vector[];

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
    //@ts-ignore
    this.dc.canvas.clear();
    const bounds = Rectangle.fromPoints(this.verticesPositions);
    this.dc.goTo(bounds.addSpace(this.options.padding));

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

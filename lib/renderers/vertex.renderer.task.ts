import Vector from "../structs/Vector";
import { Vertex } from "../structs/Vertex";
import { MergePrepareData, TaskOption } from "../tasks/Task";
import { RenderTask } from "../tasks/render.task";

export interface VertexRendererOptions {
  color: string;
  radius: number;
}
export abstract class VertexRendererTask<
  OPTIONS extends object = {}
> extends RenderTask<OPTIONS & VertexRendererOptions> {
  protected verticesPositions: Vector[];
  constructor(protected vertex: Vertex) {
    super();
  }
  prepare(
    data: MergePrepareData<{ verticesPositions: Vector[] }, RenderTask>
  ): VertexRendererTask<OPTIONS> {
    super.prepare(data);
    this.verticesPositions = data.verticesPositions;
    return this;
  }

  prepareHoverTask(
    hoverTask: VertexRendererTask<object>
  ): VertexRendererTask<object> {
    return hoverTask.prepare({
      dc: this.dc,
      verticesPositions: this.verticesPositions,
    });
  }

  preparePressTask(
    hoverTask: VertexRendererTask<object>
  ): VertexRendererTask<object> {
    return hoverTask.prepare({
      dc: this.dc,
      verticesPositions: this.verticesPositions,
    });
  }
}

export interface BasicVertexRendererOptions {
  glowColor: string;
  glowRadius: number[];
}
export class BasicVertexRendererTask extends VertexRendererTask<BasicVertexRendererOptions> {
  protected defaultOptions(): TaskOption<BasicVertexRendererTask> {
    return {
      glowColor: "white",
      glowRadius: [40],
      color: "white",
      radius: 0.3,
    };
  }

  onRun(): void {
    super.onRun();
    if (this.skip) {
      return;
    }

    const vertex = this.vertex;
    const vector = this.verticesPositions[vertex.Id];

    this.dc.canvas.noStroke();
    this.dc.canvas.fill(this.options.color);

    for (const radius of this.options.glowRadius) {
      this.glow(this.options.glowColor, radius);
      this.dc.canvas.ellipse(
        vector.x,
        vector.y,
        this.options.radius,
        this.options.radius
      );
    }

    this.noGlow();
    this.dc.canvas.ellipse(
      vector.x,
      vector.y,
      this.options.radius,
      this.options.radius
    );

    this.done();
  }

  mouseHovered(): boolean {
    const vertex = this.vertex;
    const vector = this.verticesPositions[vertex.Id];
    const radius = this.options.radius;
    const mouse = new Vector(
      this.dc.canvas.mouseX / this.dc.ScalingFactor - this.dc.Translation.x,
      this.dc.canvas.mouseY / this.dc.ScalingFactor - this.dc.Translation.y
    );
    return vector.dist(mouse) < radius / 2;
  }
}

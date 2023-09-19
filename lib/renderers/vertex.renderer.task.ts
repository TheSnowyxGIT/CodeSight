import Vector from "../structs/Vector";
import { Vertex } from "../structs/Vertex";
import { MergePrepareData, PrepareData, TaskOption } from "../tasks/Task";
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
  showTag: boolean;
}
export class BasicVertexRendererTask extends VertexRendererTask<BasicVertexRendererOptions> {
  protected defaultOptions(): TaskOption<BasicVertexRendererTask> {
    return {
      glowColor: "white",
      glowRadius: [40],
      color: "white",
      radius: 0.3,
      showTag: false,
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

    if (this.options.showTag) {
      this.dc.canvas.fill("white");
      this.dc.canvas.textSize(2);
      this.dc.canvas.textAlign("center", "center");
      this.dc.canvas.text(vertex.tag(), vector.x, vector.y);
    }

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

export interface BlinkVertexRendererOptions {
  showTag: boolean;
  speed: number;
  blinkColor: string;
}
export class BlinkVertexRendererTask extends VertexRendererTask<BlinkVertexRendererOptions> {
  protected defaultOptions(): TaskOption<BlinkVertexRendererTask> {
    return {
      color: "white",
      radius: 0.3,
      showTag: false,
      speed: 0.001,
      blinkColor: "blue",
    };
  }

  private current: number = 0;

  public prepare(
    data: PrepareData<VertexRendererTask>
  ): VertexRendererTask<BlinkVertexRendererOptions> {
    super.prepare(data);
    this.current = 0;
    return this;
  }

  onRun(): void {
    super.onRun();
    if (this.skip) {
      return;
    }

    const vertex = this.vertex;
    const vector = this.verticesPositions[vertex.Id];

    this.noGlow();
    this.dc.canvas.noStroke();
    this.dc.canvas.fill(this.options.color);
    this.dc.canvas.ellipse(
      vector.x,
      vector.y,
      this.options.radius,
      this.options.radius
    );

    const blinkColor = this.dc.canvas.color(this.options.blinkColor);
    blinkColor.setAlpha(200 * Math.abs(Math.sin(this.current)));

    this.dc.canvas.fill(blinkColor);
    this.dc.canvas.ellipse(
      vector.x,
      vector.y,
      this.options.radius,
      this.options.radius
    );

    if (this.options.showTag) {
      this.dc.canvas.fill("white");
      this.dc.canvas.textSize(2);
      this.dc.canvas.textAlign("center", "center");
      this.dc.canvas.text(vertex.tag(), vector.x, vector.y);
    }

    this.current += this.options.speed * this.dc.canvas.deltaTime;
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

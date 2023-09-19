import { Edge } from "../structs/Edge";
import Vector from "../structs/Vector";
import { MergePrepareData, TaskOption, PrepareData } from "../tasks/Task";
import { RenderTask } from "../tasks/render.task";

export interface EdgeRendererOptions {
  color: string;
  edgeWeight: number;
  showWeight: boolean;
}
export abstract class EdgeRendererTask<
  OPTION extends object = {}
> extends RenderTask<OPTION & EdgeRendererOptions> {
  protected verticesPositions: Vector[];
  constructor(protected edge: Edge) {
    super();
  }
  prepare(
    data: MergePrepareData<{ verticesPositions: Vector[] }, RenderTask>
  ): EdgeRendererTask<OPTION> {
    super.prepare(data);
    this.verticesPositions = data.verticesPositions;
    return this;
  }

  prepareHoverTask(
    hoverTask: EdgeRendererTask<object>
  ): EdgeRendererTask<object> {
    return hoverTask.prepare({
      dc: this.dc,
      verticesPositions: this.verticesPositions,
    });
  }

  preparePressTask(
    hoverTask: EdgeRendererTask<object>
  ): EdgeRendererTask<object> {
    return hoverTask.prepare({
      dc: this.dc,
      verticesPositions: this.verticesPositions,
    });
  }
}

export interface BasicEdgeRendererOptions {}
export class BasicEdgeRenderer extends EdgeRendererTask<BasicEdgeRendererOptions> {
  defaultOptions(): TaskOption<BasicEdgeRenderer> {
    return {
      color: "#ffffff",
      edgeWeight: 0.1,
      showWeight: false,
    };
  }
  onRun(): void {
    const edge = this.edge;
    const a = this.verticesPositions[edge.A.Id];
    const b = this.verticesPositions[edge.B.Id];

    this.dc.canvas.stroke(this.options.color);
    this.dc.canvas.strokeWeight(this.options.edgeWeight);
    this.dc.canvas.line(a.x, a.y, b.x, b.y);

    if (this.options.showWeight && edge.Weight !== undefined) {
      this.dc.canvas.textAlign("left", "center");
      this.dc.canvas.textSize(1.5);

      this.dc.canvas.text(edge.Weight, (a.x + b.x) / 2, (a.y + b.y) / 2);
    }

    this.done();
  }

  mouseHovered(): boolean {
    return false;
  }
}

export interface ProgressEdgeRendererOptions {
  duration: number;
  reversed: boolean;
  progressColor: string;
}
export class ProgressEdgeRendererTask extends EdgeRendererTask<ProgressEdgeRendererOptions> {
  defaultOptions(): TaskOption<ProgressEdgeRendererTask> {
    return {
      color: "#000000",
      progressColor: "#ff0000",
      reversed: false,
      edgeWeight: 0.1,
      duration: 1000,
      showWeight: false,
    };
  }
  private current: number = 0;

  public prepare(
    data: PrepareData<EdgeRendererTask>
  ): EdgeRendererTask<ProgressEdgeRendererOptions> {
    super.prepare(data);
    this.current = 0;
    return this;
  }

  onRun(): void {
    const edge = this.edge;
    let a = this.verticesPositions[edge.A.Id];
    let b = this.verticesPositions[edge.B.Id];
    if (this.options.reversed) {
      [a, b] = [b, a];
    }

    const direction = Vector.sub(b, a).normalize();
    const length = Vector.sub(b, a).mag();
    const dt = this.dc.canvas.deltaTime;

    const currentLength = length * (this.current / this.options.duration);
    const currentB = Vector.add(a, direction.mult(currentLength));

    this.dc.canvas.stroke(this.options.color);
    this.dc.canvas.strokeWeight(this.options.edgeWeight);
    this.dc.canvas.line(a.x, a.y, b.x, b.y);

    this.dc.canvas.stroke(this.options.progressColor);
    this.dc.canvas.strokeWeight(this.options.edgeWeight);
    this.dc.canvas.line(a.x, a.y, currentB.x, currentB.y);

    this.current += dt;
    if (this.current > this.options.duration) {
      this.current = this.options.duration;
      this.done();
    }
  }

  mouseHovered(): boolean {
    return false;
  }
}

export interface HSVEdgeRendererOptions {}
export class HSVEdgeRendererTask extends EdgeRendererTask<HSVEdgeRendererOptions> {
  defaultOptions(): TaskOption<HSVEdgeRendererTask> {
    return {
      color: "#000000",
      edgeWeight: 0.1,
      showWeight: false,
    };
  }

  public prepare(
    data: PrepareData<EdgeRendererTask>
  ): EdgeRendererTask<HSVEdgeRendererOptions> {
    super.prepare(data);
    return this;
  }

  onRun(): void {
    const edge = this.edge;
    let a = this.verticesPositions[edge.A.Id];
    let b = this.verticesPositions[edge.B.Id];

    const canvasWidth = this.dc.getWidth() / 2;
    const length = Vector.sub(b, a).mag();
    const minLength = canvasWidth / 5;

    const aa = (20 - 100) / (canvasWidth - minLength);
    const cc = 100 + aa * minLength;
    let opacity = aa * length + cc;
    opacity = Math.max(20, Math.min(100, opacity));

    this.dc.canvas.colorMode(this.dc.canvas.HSB, canvasWidth, 100, 100, 100);
    const color = this.dc.canvas.color((b.x + a.x) / 2, 100, 100, opacity);
    this.dc.canvas.stroke(color);
    this.dc.canvas.strokeWeight(this.options.edgeWeight);
    this.glow(color.toString("#rgb"), 60);
    this.dc.canvas.line(a.x, a.y, b.x, b.y);
    this.glow(color.toString("#rgb"), 30);
    this.dc.canvas.line(a.x, a.y, b.x, b.y);
    this.glow(color.toString("#rgb"), 20);
    this.dc.canvas.line(a.x, a.y, b.x, b.y);
    this.noGlow();

    this.dc.canvas.colorMode(this.dc.canvas.RGB, 255);

    this.done();
  }

  mouseHovered(): boolean {
    return false;
  }
}

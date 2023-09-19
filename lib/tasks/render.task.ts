import { MergePrepareData, PrepareData, Task } from "./Task";
import { DrawingContext } from "./DrawingContext";

export abstract class Drawable<RT extends RenderTask<object>> {
  protected renderTask: RT = null;
  public get RenderTask(): RT {
    if (this.renderTask === null) this.resetRenderTask();
    return this.renderTask;
  }
  constructor() {}
  protected abstract defaultRenderTask(): RT;
  resetRenderTask() {
    this.renderTask = this.defaultRenderTask();
  }
  setRenderTask(task: RT) {
    this.renderTask = task;
  }
  withRenderTask(task: RT): this {
    this.renderTask = task;
    return this;
  }
}

export interface RenderTaskOptions {
  hoverTask?: RenderTask<object>;
  pressTask?: RenderTask<object>;
}
export interface RenderTaskPrepareData {
  dc: DrawingContext;
}
export abstract class RenderTask<OPTION extends object = {}> extends Task<
  OPTION & RenderTaskOptions
> {
  protected dc: DrawingContext;
  protected isHover: boolean = false;
  protected isPress: boolean = false;

  public prepare(
    data: MergePrepareData<RenderTaskPrepareData, Task>
  ): RenderTask<OPTION> {
    super.prepare(data);
    this.dc = data.dc;
    this.isHover = false;
    this.isPress = false;
    return this;
  }

  protected onRun(): void {
    if (this.mouseHovered()) {
      if (this.options.pressTask) {
        if (!this.isHover) {
          this.dc.canvas.cursor("pointer");
        }
      }
      if (this.options.hoverTask) {
        if (!this.isHover) {
          this.prepareHoverTask(this.options.hoverTask);
        }
        this.options.hoverTask.run();
        this.skip = true;
      }
      this.isHover = true;
    } else {
      if (this.isHover) {
        this.dc.canvas.cursor("default");
      }
      this.isHover = false;
    }

    if (this.dc.canvas.mouseIsPressed && this.isHover) {
      if (this.options.pressTask) {
        if (!this.isPress) {
          this.preparePressTask(this.options.pressTask);
        }
        this.options.pressTask.run();
        this.skip = true;
      }
      this.isPress = true;
    } else {
      if (!this.dc.canvas.mouseIsPressed && this.isPress && this.isHover) {
        this.dc.canvas.cursor("default");
        this.emit("click");
      }
      this.isPress = false;
    }
  }

  protected glow(glowColor: string, blurriness: number): void {
    this.dc.canvas.drawingContext.shadowColor = glowColor;
    this.dc.canvas.drawingContext.shadowBlur = blurriness;
  }

  protected noGlow(): void {
    this.dc.canvas.drawingContext.shadowColor = null;
    this.dc.canvas.drawingContext.shadowBlur = 0;
  }

  abstract mouseHovered(): boolean;
  abstract prepareHoverTask(hoverTask: RenderTask<object>): RenderTask<object>;
  abstract preparePressTask(hoverTask: RenderTask<object>): RenderTask<object>;
}

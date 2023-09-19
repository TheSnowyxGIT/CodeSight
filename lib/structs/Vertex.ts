import {
  VertexRendererTask,
  BasicVertexRendererTask,
} from "../renderers/vertex.renderer.task";
import { Drawable } from "../tasks/render.task";

export class Vertex extends Drawable<VertexRendererTask<object>> {
  private id: number;

  public get Id(): number {
    return this.id;
  }

  public tag(): string {
    if (this.id < 0) {
      throw new Error("Invalid input. Please provide a non-negative number.");
    }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (this.id < chars.length) {
      return chars[this.id];
    }

    let result = "";
    while (this.id >= 0) {
      let remainder = this.id % chars.length;
      result = chars[remainder] + result;
      this.id = Math.floor(this.id / chars.length) - 1;
    }

    return result;
  }

  constructor(id: number) {
    super();
    this.id = id;
  }

  protected defaultRenderTask(): VertexRendererTask<object> {
    return new BasicVertexRendererTask(this);
  }
}

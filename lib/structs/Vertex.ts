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

  constructor(id: number) {
    super();
    this.id = id;
  }

  protected defaultRenderTask(): VertexRendererTask<object> {
    return new BasicVertexRendererTask(this);
  }
}

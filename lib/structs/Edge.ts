import {
  BasicEdgeRenderer,
  EdgeRendererTask,
  HSVEdgeRendererTask,
} from "../renderers/edge.renderer.task";
import { Drawable } from "../tasks/render.task";
import { Vertex } from "./Vertex";

export class Edge extends Drawable<EdgeRendererTask<object>> {
  private a: Vertex;
  private b: Vertex;
  private directed: boolean;

  public get A(): Vertex {
    return this.a;
  }

  public get B(): Vertex {
    return this.b;
  }

  public get Directed(): boolean {
    return this.directed;
  }

  constructor(from: Vertex, to: Vertex, directed: boolean) {
    super();
    this.a = from;
    this.b = to;
    this.directed = directed;
  }

  protected defaultRenderTask(): EdgeRendererTask<object> {
    return new HSVEdgeRendererTask(this);
  }
}

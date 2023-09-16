import { Box, Circle, Point } from "js-quadtree";

export default class QuadTree {
  private capacity: number;

  private points: Point[] = [];
  public ne: QuadTree | null = null;
  public nw: QuadTree | null = null;
  public se: QuadTree | null = null;
  public sw: QuadTree | null = null;

  public container: Box;

  constructor(container: Box, capacity: number = 4) {
    this.capacity = capacity;
    this.container = container;
  }

  insert(point: Point): boolean {
    if (!this.container.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (!this.ne) {
      this.subdivide();
    }

    return (
      this.ne.insert(point) ||
      this.nw.insert(point) ||
      this.se.insert(point) ||
      this.sw.insert(point)
    );
  }

  private intersects(circle: Circle): boolean {
    const { x, y, w, h } = this.container;

    const dx = Math.abs(circle.x - x - w / 2);
    const dy = Math.abs(circle.y - y - h / 2);

    if (dx > w / 2 + circle.r) {
      return false;
    }

    if (dy > h / 2 + circle.r) {
      return false;
    }

    if (dx <= w / 2) {
      return true;
    }

    if (dy <= h / 2) {
      return true;
    }

    const cornerDistanceSq = (dx - w / 2) ** 2 + (dy - h / 2) ** 2;

    return cornerDistanceSq <= circle.r ** 2;
  }

  subdivide() {
    const { x, y, w, h } = this.container;

    const ne = new Box(x + w / 2, y, w / 2, h / 2);
    const nw = new Box(x, y, w / 2, h / 2);
    const se = new Box(x + w / 2, y + h / 2, w / 2, h / 2);
    const sw = new Box(x, y + h / 2, w / 2, h / 2);

    this.ne = new QuadTree(ne, this.capacity);
    this.nw = new QuadTree(nw, this.capacity);
    this.se = new QuadTree(se, this.capacity);
    this.sw = new QuadTree(sw, this.capacity);
  }

  query(circle: Circle): Point[] {
    const points: Point[] = [];

    if (!this.intersects(circle)) {
      return points;
    }

    for (const point of this.points) {
      if (circle.contains(point)) {
        points.push(point);
      }
    }

    if (!this.ne) {
      return points;
    }

    return [
      ...points,
      ...this.ne.query(circle),
      ...this.nw.query(circle),
      ...this.se.query(circle),
      ...this.sw.query(circle),
    ];
  }
}

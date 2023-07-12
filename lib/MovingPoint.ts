import { Box } from "js-quadtree";

export default class MovingPoint {
  public x: number;
  public y: number;
  public angle: number;
  public speed: number;

  constructor(x: number, y: number, angle: number, speed: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
  }

  public update(deltaTime: number): void {
    this.x += this.speed * Math.cos(this.angle) * (deltaTime / 1000);
    this.y += this.speed * Math.sin(this.angle) * (deltaTime / 1000);
  }
}

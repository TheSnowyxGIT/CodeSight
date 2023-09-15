import Vector from "../structs/Vector";
import type p5 from "p5";

export class Rectangle {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  static fromPoints(points: Vector[]): Rectangle {
    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;
    for (const point of points) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
    return new Rectangle(minX, minY, maxX - minX, maxY - minY);
  }

  constructor(x: number, y: number, width: number, height: number) {
    if (width < 0 || height < 0) {
      throw new Error(`Invalid rectangle: ${x}, ${y}, ${width}, ${height}`);
    }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  addSpace(space: number): Rectangle {
    this.x = this.x - space;
    this.y = this.y - space;
    this.width = this.width + 2 * space;
    this.height = this.height + 2 * space;
    return this;
  }
}

export class DrawingContext {
  public canvas: p5;
  private scalingFactor: number = 1;
  private translation: Vector = new Vector(0, 0);
  public get ScalingFactor(): number {
    return this.scalingFactor;
  }
  public get Translation(): Vector {
    return this.translation;
  }

  constructor(canvas: p5) {
    this.canvas = canvas;
  }

  goTo(rectangle: Rectangle) {
    const { x, y, width, height } = rectangle;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const xScalingFactor = canvasWidth / width;
    const yScalingFactor = canvasHeight / height;
    this.scalingFactor = Math.min(xScalingFactor, yScalingFactor);
    this.canvas.scale(this.scalingFactor);
    const newCanvasWidth = canvasWidth / this.scalingFactor;
    const newCanvasHeight = canvasHeight / this.scalingFactor;
    const xTranslation = (newCanvasWidth - width) / 2;
    const yTranslation = (newCanvasHeight - height) / 2;
    this.translation = new Vector(-x + xTranslation, -y + yTranslation);
    this.canvas.translate(this.translation.x, this.translation.y);
  }

  getWidth(): number {
    return this.canvas.width / this.scalingFactor;
  }

  getHeight(): number {
    return this.canvas.height / this.scalingFactor;
  }
}

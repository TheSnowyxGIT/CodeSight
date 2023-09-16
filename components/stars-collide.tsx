"use client";
import React, { Component } from "react";
import P5Sketch from "./p5/sketch.component";
import MovingPoint from "@/lib/MovingPoint";
import type p5 from "p5";
import { Box, Circle, Point } from "js-quadtree";
import QuadTree from "@/lib/structs/QuadTree";

export interface StarsCollideProps {
  className?: string;
}

export default class StarsCollide extends Component<StarsCollideProps> {
  private points: MovingPoint[] = [];
  private speedRange = [30, 60];
  private maxDetectionRadius = 150;

  private getNumberOfPointsBySize = (p5: p5) => {
    const v1 = { pixels: 400 * 800, nb: 30 };
    const v2 = { pixels: 1300 * 800, nb: 100 };
    const width = p5.width;
    const height = p5.height;
    const pixels = width * height;
    const a = (v2.nb - v1.nb) / (v2.pixels - v1.pixels);
    const b = v1.nb - a * v1.pixels;
    return Math.round(a * pixels + b);
  };

  private makeQuadTree = (p5: p5) => {
    const quadTree = new QuadTree(new Box(0, 0, p5.width, p5.height));
    for (let i = 0; i < this.points.length; i++) {
      quadTree.insert(
        new Point(this.points[i].x, this.points[i].y, this.points[i])
      );
    }
    return quadTree;
  };

  private glow = (p5: p5, color: string, v: number) => {
    p5.drawingContext.shadowColor = color;
    p5.drawingContext.shadowBlur = v;
  };

  private noGlow = (p5: p5) => {
    p5.drawingContext.shadowBlur = 0;
  };

  private getOpacity = (distance: number) => {
    const v1 = { distance: 0, opacity: 100 };
    const v2 = { distance: this.maxDetectionRadius, opacity: 0 };
    const a = (v2.opacity - v1.opacity) / (v2.distance - v1.distance);
    const b = v1.opacity - a * v1.distance;
    return a * distance + b;
  };

  private setup = (p5: p5) => {
    this.points = [];
    const numberOfPoints = this.getNumberOfPointsBySize(p5);
    for (let i = 0; i < numberOfPoints; i++) {
      this.points.push(
        new MovingPoint(
          p5.random(0, p5.width),
          p5.random(0, p5.height),
          p5.random(0, 2 * p5.PI),
          p5.random(this.speedRange[0], this.speedRange[1])
        )
      );
    }
    p5.colorMode(p5.HSB, p5.width, 100, 100, 100);
  };

  private draw = (p5: p5) => {
    p5.colorMode(p5.RGB);
    p5.background(15, 23, 42);
    p5.colorMode(p5.HSB, p5.width, 100, 100, 100);
    if (p5.deltaTime > 2000) {
      this.setup(p5);
      return;
    }
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].update(p5.deltaTime);
      if (this.points[i].x < 0) {
        this.points[i].x = p5.width;
      }
      if (this.points[i].x > p5.width) {
        this.points[i].x = 0;
      }
      if (this.points[i].y < 0) {
        this.points[i].y = p5.height;
      }
      if (this.points[i].y > p5.height) {
        this.points[i].y = 0;
      }
    }
    const quadTree = this.makeQuadTree(p5);

    for (let i = 0; i < this.points.length; i++) {
      const pointI = this.points[i];

      const pointsInRange = quadTree.query(
        new Circle(pointI.x, pointI.y, this.maxDetectionRadius)
      );
      for (let j = 0; j < pointsInRange.length; j++) {
        const pointJ = pointsInRange[j].data;
        if (pointI !== pointsInRange[j].data) {
          const distance = p5
            .createVector(pointI.x, pointI.y)
            .dist(p5.createVector(pointJ.x, pointJ.y));

          const color = p5.color(
            (pointI.x + pointsInRange[j].x) / 2,
            100,
            100,
            this.getOpacity(distance)
          );
          p5.stroke(color);
          p5.line(pointI.x, pointI.y, pointJ.x, pointJ.y);
        }
      }
      p5.noStroke();
      p5.fill(0, 0, 100);
      this.glow(p5, "#fff", 10);
      p5.circle(pointI.x, pointI.y, 5);
      this.glow(p5, "#fff", 30);
      p5.circle(pointI.x, pointI.y, 5);
      this.noGlow(p5);
    }
  };

  private windowResized = (p5: p5) => {
    const numberOfPoints = this.getNumberOfPointsBySize(p5);
    if (numberOfPoints > this.points.length) {
      for (let i = this.points.length; i < numberOfPoints; i++) {
        this.points.push(
          new MovingPoint(
            p5.random(0, p5.width),
            p5.random(0, p5.height),
            p5.random(0, 2 * p5.PI),
            p5.random(this.speedRange[0], this.speedRange[1])
          )
        );
      }
    }
    if (numberOfPoints < this.points.length) {
      this.points = this.points.slice(0, numberOfPoints);
    }
    p5.colorMode(p5.HSB, p5.width, 100, 100, 100);
  };

  render() {
    return (
      <P5Sketch
        className={this.props.className}
        responsive
        setup={this.setup}
        draw={this.draw}
        windowResized={this.windowResized}
      />
    );
  }
}

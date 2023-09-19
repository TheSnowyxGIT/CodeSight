"use client";
import React, { Component } from "react";
import P5Sketch from "../p5/sketch.component";
import MovingPoint from "@/lib/MovingPoint";
import type p5 from "p5";
import { Box, Circle, Point } from "js-quadtree";
import QuadTree from "@/lib/structs/QuadTree";

export interface QuadTreeDemoProps {
  className?: string;
  onFPS?: (fps: number) => void;
  defaultNumberOfPoints?: number;
}

export default class QuadTreeDemo extends Component<QuadTreeDemoProps> {
  private points: MovingPoint[] = [];
  private speedRange = [30, 60];
  private maxDetectionRadius = 30;
  private quadtreeActive = true;
  private stopped = false;
  private displayQuadtree = true;
  private fpsRefreshRate = 100;
  private fpsLastRefresh = 0;
  private p5: p5;

  public stop() {
    this.stopped = true;
  }

  public resume() {
    this.stopped = false;
  }

  public toggleQuadtree() {
    this.quadtreeActive = !this.quadtreeActive;
  }

  public activeQuadtree() {
    this.quadtreeActive = true;
  }

  public deactiveQuadtree() {
    this.quadtreeActive = false;
  }

  public hideQuadtree() {
    this.displayQuadtree = false;
  }

  public showQuadtree() {
    this.displayQuadtree = true;
  }

  public changeNumberOfPoints(numberOfPoints: number) {
    if (numberOfPoints > this.points.length) {
      for (let i = this.points.length; i < numberOfPoints; i++) {
        this.points.push(
          new MovingPoint(
            this.p5.random(0, this.p5.width),
            this.p5.random(0, this.p5.height),
            this.p5.random(0, 2 * this.p5.PI),
            this.p5.random(this.speedRange[0], this.speedRange[1])
          )
        );
      }
    }
    if (numberOfPoints < this.points.length) {
      this.points = this.points.slice(0, numberOfPoints);
    }
  }

  private makeQuadTree = (p5: p5) => {
    const quadTree = new QuadTree(new Box(0, 0, p5.width, p5.height), 2);
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

  private drawQuadTree = (p5: p5, quadTree: QuadTree) => {
    const box = quadTree.container;
    p5.stroke(0, 0, 100);
    p5.noFill();
    p5.rect(box.x, box.y, box.w, box.h);
    if (quadTree.ne) {
      this.drawQuadTree(p5, quadTree.ne);
      this.drawQuadTree(p5, quadTree.nw);
      this.drawQuadTree(p5, quadTree.sw);
      this.drawQuadTree(p5, quadTree.se);
    }
  };

  private setup = (p5: p5) => {
    this.p5 = p5;
    this.points = [];
    const numberOfPoints = this.props.defaultNumberOfPoints ?? 100;
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
    if (p5.millis() - this.fpsLastRefresh > this.fpsRefreshRate) {
      this.fpsLastRefresh = p5.millis();
      this.props.onFPS?.(p5.frameRate());
    }
    if (this.stopped) {
      return;
    }
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
    if (this.quadtreeActive) {
      const quadTree = this.makeQuadTree(p5);

      if (this.displayQuadtree) {
        this.drawQuadTree(p5, quadTree);
      }

      for (let i = 0; i < this.points.length; i++) {
        const pointI = this.points[i];

        const pointsInRange = quadTree.query(
          new Circle(pointI.x, pointI.y, this.maxDetectionRadius)
        );
        for (let j = 0; j < pointsInRange.length; j++) {
          const pointJ = pointsInRange[j].data;
          if (pointI !== pointsInRange[j].data) {
            const color = p5.color(
              (pointI.x + pointsInRange[j].x) / 2,
              100,
              100
            );
            p5.stroke(color);
            p5.line(pointI.x, pointI.y, pointJ.x, pointJ.y);
          }
        }
        p5.noStroke();
        p5.fill(0, 0, 90);
        p5.circle(pointI.x, pointI.y, 10);
      }
    } else {
      for (let i = 0; i < this.points.length; i++) {
        const pointI = this.points[i];
        for (let j = 0; j < this.points.length; j++) {
          const pointJ = this.points[j];
          if (pointI !== pointJ) {
            const distance = p5
              .createVector(pointI.x, pointI.y)
              .dist(p5.createVector(pointJ.x, pointJ.y));
            if (distance < this.maxDetectionRadius) {
              const color = p5.color((pointI.x + pointJ.x) / 2, 100, 100);
              p5.stroke(color);
              p5.line(pointI.x, pointI.y, pointJ.x, pointJ.y);
            }
          }
        }
        p5.noStroke();
        p5.fill(0, 0, 100);
        p5.circle(pointI.x, pointI.y, 10);
      }
    }
  };

  private windowResized = (p5: p5) => {
    const numberOfPoints = this.props.defaultNumberOfPoints ?? 100;
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

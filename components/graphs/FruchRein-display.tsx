"use client";
import { GraphGenerator } from "@/lib/algorithms/graph-generate";
import { Graph } from "@/lib/structs/Graph";
import React, { Component, Ref, RefObject, createRef } from "react";
import P5Sketch from "../p5/sketch.component";
import type p5 from "p5";
import { TaskRunner } from "@/lib/tasks/task.runner";
import { FruchReinRenderTask } from "@/lib/renderers/frunchRein.renderer.task";

export interface FruchReinDisplayProps {
  className?: string;
}

export default class FruchReinDisplay extends Component<FruchReinDisplayProps> {
  private graph: Graph;
  private taskRunner: TaskRunner;
  private p5Sketch: RefObject<P5Sketch>;
  private fruchReinTask: FruchReinRenderTask;

  constructor(props: FruchReinDisplayProps) {
    super(props);
    this.taskRunner = new TaskRunner();
    this.p5Sketch = createRef();
  }

  async componentDidMount(): Promise<void> {
    const graphGenerator = new GraphGenerator();
    this.graph = await graphGenerator.basicGenerate(8, 15);
    this.fruchReinTask = new FruchReinRenderTask(this.graph);
    // wait p5 to be loaded
    await this.p5Sketch.current?.loaded;
    this.taskRunner.startTask(this.fruchReinTask, {
      dc: this.p5Sketch.current.dc,
    });
  }

  public changeCRep = (cRep: number) => {
    this.fruchReinTask.options.C_rep = cRep;
  };

  public changeCSpring = (cSpring: number) => {
    this.fruchReinTask.options.C_spring = cSpring;
  };

  public changeL = (l: number) => {
    this.fruchReinTask.options.l = l;
  };

  public restart() {
    this.fruchReinTask.resetPositions();
    this.taskRunner.startTask(this.fruchReinTask, {
      dc: this.p5Sketch.current.dc,
    });
  }

  public async generate(graphType: string) {
    console.log(graphType);
    const graphGenerator = new GraphGenerator();
    let graph: Graph;
    if (graphType === "random") {
      graph = await graphGenerator.basicGenerate(8, 15);
    } else if (graphType === "complete") {
      graph = await graphGenerator.completeGenerate(8);
    } else {
      throw new Error("Not implemented");
    }
    this.fruchReinTask.changeGraph(graph);
    this.restart();
  }

  private setup = (p5: p5) => {};

  private draw = (p5: p5) => {
    this.taskRunner.run();
  };

  private windowResized = (p5: p5) => {
    if (!this.taskRunner.running) {
      this.taskRunner.startTask(this.fruchReinTask, {
        dc: this.p5Sketch.current.dc,
      });
    }
  };

  render() {
    return (
      <P5Sketch
        ref={this.p5Sketch}
        className={this.props.className}
        responsive
        setup={this.setup}
        draw={this.draw}
        windowResized={this.windowResized}
      />
    );
  }
}

"use client";
import React from "react";
import FruchReinDisplay from "@/components/graphs/FruchRein-display";
import MathJax from "react-mathjax";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Highlight } from "prism-react-renderer";
import QuadTreeDemo from "@/components/QuadTreeDemo";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const pseudoCode = `
class ForceDirectedLayout {
    graph: Graph
    C_rep: number
    C_spring: number
    l: number
    verticesPositions: Array of Vectors
    maxIterations: number
    thresholdForce: number
    iterations: number
    
    Initialize(graph: Graph) {
        // Store the graph
        // Set constants C_rep, C_spring, and l
        // Initialize verticesPositions with random positions
        // Set maxIterations, thresholdForce, and iterations to predefined values
    }

     calculateRepulsiveForce(u: Vertex, v: Vertex) -> Vector {
        // Get the coordinates of u and v
        // Calculate the direction vector from v to u
        // Calculate the distance between u and v
        // Return the repulsive force using the formula
     }

     calculateAttractiveForce(u: Vertex, v: Vertex) -> Vector {
        // Get the coordinates of u and v
        // Calculate the direction vector from u to v
        // Calculate the distance between u and v
        // Return the attractive force using the formula
     }

    calculateForce(u: Vertex) -> Vector {
        // Initialize a zero vector for repulsiveForces
        // For each vertex v in the graph:
        //     If u is not v:
        //         Add the repulsive force between u and v to repulsiveForces
        
        // Initialize a zero vector for attractiveForces
        // For each vertex v adjacent to u:
        //     If u is not v:
        //         Add the attractive force between u and v to attractiveForces
        
        // Return the sum of repulsiveForces and attractiveForces
    }

    calculateForces() -> Array of Vectors {
        // Initialize an empty array for forces
        // For each vertex in the graph:
        //     Calculate the net force acting on the vertex
        //     Append the net force to the forces array
        
        // Return forces
    }

    processOneStep() {
        // Calculate forces for all vertices
        // For each vertex in the graph:
        //     Calculate the new position by adding the force to the current position
        //     Update the position of the vertex in verticesPositions
        
        // Increment the iteration counter
        // Calculate the maximum force magnitude across all vertices
        
        // Return the maximum force magnitude
    }

    processAllSteps() {
        // Reset the iteration counter
        // Initialize a variable for the maximum force magnitude
        // Repeat until the maximum force magnitude is below the threshold or until the maximum iterations is reached:
        //     Calculate the maximum force magnitude using processOneStep
        
        // Return the final verticesPositions
    }
}
`;

const QuadTreeContentPage: React.FC = () => {
  const quadTreeDemoRef = React.useRef<QuadTreeDemo>(null);

  const [nbPoints, setNbPoints] = React.useState(500);
  const [algType, setAlgType] = React.useState("quadtree");
  const [fps, setFPS] = React.useState(60);
  const [showQuadtree, setShowQuadtree] = React.useState(true);

  return (
    <MathJax.Provider>
      <div className="pt-4 prose max-w-none ml prose-slate dark:prose-invert">
        <div className="not-prose h-[400px] relative">
          <a
            href="#playground"
            className="absolute right-0 flex-none text-sm text-center font-semibold text-white py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-sky-500 dark:text-white focus:outline-none hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:highlight-white/20 dark:hover:bg-sky-400 dark:focus:ring-2 dark:focus:ring-sky-600 dark:focus:ring-offset-slate-900 translate-y-4 -translate-x-4"
          >
            Go to Benchmark
          </a>
          <QuadTreeDemo defaultNumberOfPoints={100} />
        </div>
        <h2 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Introduction
          </a>
        </h2>
        <p>
          Quadtrees are tree data structures used to represent two-dimensional
          spatial data. Each node in a quadtree subdivides the space it
          represents into four equal quadrants. This hierarchical partitioning
          allows for efficient operations on spatial data, such as range queries
          and collision detection.
        </p>
        <h2 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Basics of Quadtrees
          </a>
        </h2>
        <ul>
          <li>
            <strong>Node Structure</strong>: Each node in a quadtree represents
            a rectangular section of space. It may contain a data point and up
            to four child nodes, each representing one of the four quadrants.
          </li>
          <li>
            <strong>Insertion</strong>: When inserting a point into a quadtree,
            we start at the root and traverse down the tree. At each node, we
            determine in which quadrant the point lies and move to the
            corresponding child node until we reach a suitable position for
            insertion.
          </li>
        </ul>
        <h2 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Benefits of Using Quadtrees
          </a>
        </h2>
        <ul>
          <li>
            <strong>Efficiency</strong>: Quadtrees allow us to quickly ignore
            large portions of data by eliminating sections of space that are of
            no interest.
          </li>
          <li>
            <strong>Dynamic</strong>: They can grow or shrink as needed,
            allowing for efficient insertions and deletions.
          </li>
          <li>
            <strong>Flexibility</strong>: Quadtrees can adapt to varying
            densities in spatial data.
          </li>
        </ul>
        <h2 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Time Complexity: Construction and Collision Detection
          </a>
        </h2>
        <p>
          Quadtrees are particularly advantageous when it comes to optimizing
          search operations like collision detection. However, it&apos;s
          important to understand the time complexities associated with both
          constructing the quadtree and using it for search operations:
        </p>
        <h3 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            1. Building a Quadtree
          </a>
        </h3>
        The time complexity of building a quadtree largely depends on the
        distribution of data and the depth of the tree. In the worst case, if
        points are evenly distributed such that each node is subdivided until
        the maximum allowable depth, the time complexity becomes{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`O(n \log n)`} />
        </strong>{" "}
        for{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`n`} />
        </strong>{" "}
        points. However, in practice, most datasets won&apos;t need to subdivide
        every node to the maximum depth, making the average case often much
        better than the worst
        <h3 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            1. Collision Detection Without Quadtrees
          </a>
        </h3>
        Using a brute-force method, checking for collisions or proximity of{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`n`} />
        </strong>{" "}
        points would require{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`O(n^2)`} />
        </strong>{" "}
        comparisons since every point would be checked against every other
        point.
        <h3 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            1. Collision Detection With Quadtrees
          </a>
        </h3>
        When utilizing quadtrees, the space is partitioned, enabling the
        algorithm to quickly eliminate large sections that don&apos;t need
        checking. For well-distributed data, a quadtree can reduce the number of
        checks significantly. Ideally, if each region (node) in the quadtree
        contains a constant number of points (let&apos;s say{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`k`} />
        </strong>{" "}
        points), and if the depth of the quadtree is{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`d`} />
        </strong>
        , then the complexity for searching collisions would be roughly{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`O(k^2 \times d)`} />
        </strong>
        . For a well-balanced quadtree,{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`d`} />
        </strong>{" "}
        would be proportional to{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`\log n`} />
        </strong>
        , making this far more efficient than the{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`O(n^2)`} />
        </strong>{" "}
        brute force method.
        <h2 className="flex whitespace-pre-wrap" id="playground">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Benchmark: Quadtree vs. Brute Force
          </a>
        </h2>
        <div className="flex flex-col items-center my-4 gap-4 lg:flex-row lg:gap-10">
          <div className="flex-1">
            <Select
              value={algType}
              onValueChange={(value) => {
                setAlgType(value);
                if (value === "quadtree") {
                  quadTreeDemoRef.current?.activeQuadtree();
                } else {
                  quadTreeDemoRef.current?.deactiveQuadtree();
                }
              }}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brute-force">Brute force</SelectItem>
                <SelectItem value="quadtree">QuadTree</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-1 justify-between items-center w-full lg:w-auto">
            <div className="flex-1">
              <Progress value={(fps * 100) / 60} />
            </div>
            <span className="ml-2 inline-block text-right w-28">
              {fps.toFixed(1)} fps
            </span>
          </div>
        </div>
        <div className="not-prose h-[600px]">
          <QuadTreeDemo
            ref={quadTreeDemoRef}
            className="h-full"
            defaultNumberOfPoints={nbPoints}
            onFPS={setFPS}
          />
        </div>
        <h3 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Settings
          </a>
        </h3>
        <div></div>
        <div className="pb-16">
          <div className="flex flex-col mb-4">
            <div className="flex justify-between mb-2">
              <MathJax.Node inline formula={String.raw`Number\ of\ points`} />
              <span>{nbPoints}</span>
            </div>
            <Slider
              defaultValue={[nbPoints]}
              min={1}
              max={1250}
              step={1}
              onValueChange={(values) => {
                setNbPoints(values[0]);
                quadTreeDemoRef.current?.changeNumberOfPoints(values[0]);
              }}
            />
          </div>
          <div className="flex items-center space-x-2 mt-8">
            <Switch
              id="airplane-mode"
              checked={showQuadtree}
              onCheckedChange={() => {
                setShowQuadtree(!showQuadtree);
                if (showQuadtree) {
                  quadTreeDemoRef.current?.hideQuadtree();
                } else {
                  quadTreeDemoRef.current?.showQuadtree();
                }
              }}
            />
            <span>Show QuadTree</span>
          </div>
        </div>
      </div>
    </MathJax.Provider>
  );
};

export default QuadTreeContentPage;

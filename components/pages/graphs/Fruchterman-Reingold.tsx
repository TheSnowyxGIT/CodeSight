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

interface SideBarProps {
  className?: string;
}

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

const FruchtermanReingoldContentPage: React.FC<SideBarProps> = () => {
  const fruchReinDisplayRef = React.useRef<FruchReinDisplay>(null);
  const [graphType, setGraphType] = React.useState("random");
  const [cRep, setCRep] = React.useState(2);
  const [cSpring, setCSpring] = React.useState(1);
  const [l, setL] = React.useState(3);

  return (
    <div className="pt-4 prose max-w-none ml prose-slate dark:prose-invert">
      <div className="not-prose h-[400px] relative">
        <a
          href="#playground"
          className="absolute right-0 flex-none text-sm text-center font-semibold text-white py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-sky-500 dark:text-white focus:outline-none hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:highlight-white/20 dark:hover:bg-sky-400 dark:focus:ring-2 dark:focus:ring-sky-600 dark:focus:ring-offset-slate-900"
        >
          Go to Playground
        </a>
        <FruchReinDisplay />
      </div>
      <p>
        The visualization of graphs is an area where aesthetics and
        functionality come together to provide comprehensible representations of
        abstract structures. One popular approach for graph visualization is the
        use of <strong>force-directed algorithms</strong>. Among these, the
        Fruchterman-Reingold algorithm stands out for its simplicity and its
        capacity to produce aesthetically pleasing layouts.
      </p>
      <h2 className="flex whitespace-pre-wrap">
        <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
          Introduction
        </a>
      </h2>
      <p>
        Force-directed algorithms consider graphs as physical systems, where
        nodes behave like atomic particles and edges act like springs. The
        Fruchterman-Reingold algorithm uses this concept to model attractive and
        repulsive forces among nodes, aiming to reach an equilibrium that gives
        a pleasing display.
      </p>
      <h2 className="flex whitespace-pre-wrap">
        <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
          Forces in the Fruchterman-Reingold Algorithm
        </a>
      </h2>
      <p>The algorithm essentially models two primary forces:</p>
      <h3 className="flex whitespace-pre-wrap">
        <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
          1. Attractive Force
        </a>
      </h3>
      <MathJax.Provider>
        This force acts between nodes that are connected by an edge. It&apos;s
        analogical to a spring force where nodes are attracted towards each
        other. The attractive force (
        <strong>
          <MathJax.Node inline formula={String.raw`F_{attr}(u, v)`} />
        </strong>
        ) between two nodes{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`u`} />
        </strong>{" "}
        and{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`v`} />
        </strong>{" "}
        at a distance{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`dist`} />
        </strong>{" "}
        is computed as:
        <strong className="text-xs xs:text-sm lg:text-lg">
          <MathJax.Node
            formula={String.raw`F_{attr}(u, v) = C_{spring} \times \log(\frac{dist}{l}) \times dir`}
          />
        </strong>
        Where:
        <ul>
          <li>
            <strong>
              <MathJax.Node inline formula={String.raw`dist`} />
            </strong>{" "}
            is the Euclidean distance between nodes{" "}
            <strong>
              <MathJax.Node inline formula={String.raw`u`} />
            </strong>{" "}
            and{" "}
            <strong>
              <MathJax.Node inline formula={String.raw`v`} />
            </strong>
            .
          </li>
          <li>
            <strong>
              <MathJax.Node inline formula={String.raw`dir`} />
            </strong>{" "}
            is the normalized vector pointing from node{" "}
            <strong>
              <MathJax.Node inline formula={String.raw`v`} />
            </strong>{" "}
            to node{" "}
            <strong>
              <MathJax.Node inline formula={String.raw`u`} />
            </strong>
            .
          </li>
          <li>
            <strong>
              <MathJax.Node inline formula={String.raw`C_{spring}`} />
            </strong>{" "}
            is a constant determining the strength of the spring force.
          </li>
          <li>
            <strong>
              <MathJax.Node inline formula={String.raw`l`} />
            </strong>{" "}
            is the ideal distance between the two nodes.
          </li>
        </ul>
      </MathJax.Provider>
      <h3 className="flex whitespace-pre-wrap">
        <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
          2. Repulsive Force
        </a>
      </h3>
      <MathJax.Provider>
        This force acts between every pair of nodes, ensuring that nodes repel
        each other and the graph spreads out. This force can be imagined similar
        to how like-charged particles repel in a magnetic field. The repulsive
        force (
        <strong>
          <MathJax.Node inline formula={String.raw`F_{rep}(u, v)`} />
        </strong>
        ) between two nodes{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`u`} />
        </strong>{" "}
        and{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`v`} />
        </strong>{" "}
        at a distance{" "}
        <strong>
          <MathJax.Node inline formula={String.raw`dist`} />
        </strong>{" "}
        is computed as:
        <strong className="text-xs xs:text-sm lg:text-lg">
          <MathJax.Node
            formula={String.raw`F_{rep}(u, v) = \frac{C_{rep}}{dist^2} \times dir`}
          />
        </strong>
        Where:
        <ul>
          <li>
            <strong>
              <MathJax.Node inline formula={String.raw`dist`} />
            </strong>{" "}
            is the Euclidean distance between nodes{" "}
            <strong>
              <MathJax.Node inline formula={String.raw`u`} />
            </strong>{" "}
            and{" "}
            <strong>
              <MathJax.Node inline formula={String.raw`v`} />
            </strong>
            .
          </li>
          <li>
            <strong>
              <MathJax.Node inline formula={String.raw`dir`} />
            </strong>{" "}
            is the normalized vector pointing from node{" "}
            <strong>
              <MathJax.Node inline formula={String.raw`u`} />
            </strong>{" "}
            to node{" "}
            <strong>
              <MathJax.Node inline formula={String.raw`v`} />
            </strong>
            .
          </li>
          <li>
            <strong>
              <MathJax.Node inline formula={String.raw`C_{rep}`} />
            </strong>{" "}
            is a constant determining the strength of the repulsive force.
          </li>
        </ul>
      </MathJax.Provider>
      <h2 className="flex whitespace-pre-wrap" id="pseudocode">
        <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
          Pseudocode of the Algorithm
        </a>
      </h2>
      <Highlight language="ts" code={pseudoCode}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>

      <h2 className="flex whitespace-pre-wrap" id="playground">
        <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
          Visualizing the Algorithm: Playground
        </a>
      </h2>
      <div>
        <div className="not-prose h-[600px]">
          <FruchReinDisplay ref={fruchReinDisplayRef} />
        </div>
      </div>
      <div className="flex flex-col ">
        <MathJax.Provider>
          <MathJax.Node inline formula={String.raw`Graph Type`} />
        </MathJax.Provider>
        <div className="flex items-center w-full">
          <div className="mr-4 flex-1">
            <Select value={graphType} onValueChange={setGraphType}>
              <SelectTrigger className="">
                <SelectValue placeholder="Graph type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Random</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-2">
            <button
              type="button"
              className="w-full not-prose relative flex-none text-sm text-center font-semibold text-white py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-sky-500 dark:text-white focus:outline-none hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:highlight-white/20 dark:hover:bg-sky-400 dark:focus:ring-2 dark:focus:ring-sky-600 dark:focus:ring-offset-slate-900"
              onClick={() => {
                fruchReinDisplayRef.current?.generate(graphType);
              }}
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      <h3 className="flex whitespace-pre-wrap">
        <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
          Settings
        </a>
      </h3>
      <div className="pb-16">
        <MathJax.Provider>
          <div className="flex flex-col mb-4">
            <div className="flex justify-between mb-2">
              <MathJax.Node inline formula={String.raw`C_{rep}`} />
              <span>{cRep.toFixed(2)}</span>
            </div>
            <Slider
              defaultValue={[cRep]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={(values) => {
                setCRep(values[0]);
                fruchReinDisplayRef.current?.changeCRep(values[0]);
              }}
            />
          </div>
          <div className="flex flex-col mb-4">
            <div className="flex justify-between mb-2">
              <MathJax.Node inline formula={String.raw`C_{spring}`} />
              <span>{cSpring.toFixed(2)}</span>
            </div>
            <Slider
              defaultValue={[cSpring]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={(values) => {
                setCSpring(values[0]);
                fruchReinDisplayRef.current?.changeCSpring(values[0]);
              }}
            />
          </div>
          <div className="flex flex-col mb-4">
            <div className="flex justify-between mb-2">
              <MathJax.Node inline formula={String.raw`l`} />
              <span>{l.toFixed(2)}</span>
            </div>
            <Slider
              value={[l]}
              min={1}
              max={10}
              step={0.5}
              onValueChange={(values) => {
                setL(values[0]);
                fruchReinDisplayRef.current?.changeL(values[0]);
              }}
            />
          </div>
        </MathJax.Provider>
      </div>
    </div>
  );
};

export default FruchtermanReingoldContentPage;

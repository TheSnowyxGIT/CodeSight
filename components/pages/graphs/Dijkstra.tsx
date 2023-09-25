"use client";
import React, { ReactElement } from "react";
import FruchReinDisplay from "@/components/graphs/FruchRein-display";
import MathJax from "react-mathjax";

import { Slider } from "@/components/ui/slider";
import { Highlight } from "prism-react-renderer";
import DijkstraDemo from "@/components/demos/DijkstraDemo";
import InfoBox from "@/components/boxes/infoBox";
import { Vertex } from "@/lib/structs/Vertex";

const pseudoCode = `
import { Graph, Vertex, Edge } from './yourGraphLibrary'; // Import necessary graph-related classes/interfaces

public async dijkstra(
  graph: Graph,
  sourceVertex: Vertex
): Promise<{ distances: Map<Vertex, number>; previous: Map<Vertex, Vertex | null> }> {
  const distances: Map<Vertex, number> = new Map();
  const unvisited: Set<Vertex> = new Set(graph.getVertices());
  const previous: Map<Vertex, Vertex | null> = new Map();

  // Initialize distances
  for (const vertex of graph.getVertices()) {
    distances.set(vertex, Infinity);
    previous.set(vertex, null);
  }
  distances.set(sourceVertex, 0);

  while (unvisited.size !== 0) {
    let currentVertex: Vertex | null = null;
    let smallestDistance = Infinity;

    // Find the unvisited vertex with the smallest distance
    unvisited.forEach((vertex) => {
      const dist = distances.get(vertex) ?? Infinity;
      if (dist < smallestDistance) {
        smallestDistance = dist;
        currentVertex = vertex;
      }
    });

    if (currentVertex === null) {
      break;
    }

    unvisited.delete(currentVertex);

    // Get neighbors of the current vertex
    const neighbors = graph.getAdjacentVertices(currentVertex);
    for (const neighbor of neighbors) {
      if (unvisited.has(neighbor)) {
        // Get edges between the current vertex and its neighbor
        const edges = graph.getEdgesFromVertices(currentVertex, neighbor);

        // Find the minimum-weight edge
        const minEdge: Edge = edges.reduce((prev, curr) =>
          prev.Weight < curr.Weight ? prev : curr
        );

        // Calculate the new distance to the neighbor
        const alt = distances.get(currentVertex) + minEdge.Weight!;

        // If the new distance is shorter, update the distances and previous nodes
        if (alt < distances.get(neighbor)) {
          distances.set(neighbor, alt);
          previous.set(neighbor, currentVertex);
        }
      }
    }
  }

  return { distances, previous };
}

`;

interface DijkstraProps {
  className?: string;
}

const DijkstraContentPage: React.FC<DijkstraProps> = () => {
  const [box, setBox] = React.useState<ReactElement>(<>Wait...</>);
  const [needNext, setNeedNext] = React.useState<boolean>(false);
  const [recap, setRecap] = React.useState<Map<
    Vertex,
    { finished: boolean; recap: [{ distance: number; previous?: Vertex }] }
  > | null>(null);
  const dijkstraRef = React.useRef<DijkstraDemo>(null);

  return (
    <MathJax.Provider>
      <div className="pt-4 prose max-w-none ml prose-slate dark:prose-invert">
        <div className="not-prose relative">
          <a
            href="#playground"
            className="absolute right-0 flex-none text-sm text-center font-semibold text-white py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-sky-500 dark:text-white focus:outline-none hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:highlight-white/20 dark:hover:bg-sky-400 dark:focus:ring-2 dark:focus:ring-sky-600 dark:focus:ring-offset-slate-900"
          >
            Go to Playground
          </a>
        </div>
        <h2 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Introduction
          </a>
        </h2>
        <p>
          Dijkstra&apos;s algorithm is a fundamental graph algorithm used to
          find the shortest path between nodes in a weighted graph. Named after
          its creator, Dutch computer scientist Edsger W. Dijkstra, this
          algorithm has applications in various fields, including routing in
          computer networks, transportation, and more.
        </p>
        <h2 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Basics of Dijkstra&apos;s Algorithm
          </a>
        </h2>
        <h3 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Algorithm Overview
          </a>
        </h3>
        Dijkstra&apos;s algorithm operates on a graph, which consists of nodes
        (vertices) and edges (connections between nodes). It finds the shortest
        path from a designated starting node (the source) to all other nodes in
        the graph. Here are the basic steps:
        <br />
        <ul>
          <li>
            <strong>1.</strong> <strong>Initialize</strong> a distance table:
            Create a data structure to store the shortest known distance from
            the source to each node. Initially, set the distance to the source
            node as <strong>0</strong> and the distance to all other nodes as{" "}
            <strong>infinity</strong>.
          </li>
          <li>
            <strong>2.</strong> <strong>Select</strong> the unvisited node with
            the smallest distance in the <strong>distance</strong> table.
          </li>
          <li>
            <strong>3.</strong> <strong>Update distances</strong>: For the
            selected node, consider all of its unvisited neighbors. Calculate
            their tentative distances through the current node and compare them
            with the existing recorded distances. If a shorter path is found,
            update the
            <strong>distance</strong> table.
          </li>
          <li>
            <strong>4.</strong> <strong>Mark</strong> the selected node as
            visited.
          </li>
          <li>
            <strong>5.</strong> <strong>Repeat</strong> steps{" "}
            <strong>2-4</strong> until all nodes have been visited.
          </li>
          <li>
            <strong>6.</strong> <strong>Backtrack</strong> to find the shortest
            path: After visiting all nodes, you can backtrack from the
            destination node to the source node to determine the shortest path.
          </li>
        </ul>
        <h3 className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Data Structures
          </a>
        </h3>
        <ul>
          <li>
            <strong>Distance Table</strong>: This data structure stores the
            shortest known distances from the source node to all other nodes. It
            is often implemented as an array or dictionary, where each node is
            associated with its current distance value.
          </li>
          <li>
            <strong>Priority Queue</strong>: To efficiently select the unvisited
            node with the smallest distance, a priority queue is used. This data
            structure ensures that nodes with shorter distances are selected
            first.
          </li>
          <li>
            <strong>Path Map (Previous Nodes)</strong>: In Dijkstra&apos;s
            algorithm, a data structure known as a{" "}
            <code>Map&lt;Vertex, Vertex&gt;</code> is commonly used to store
            information about the previous node for each node in the shortest
            path. In this map, each node (Vertex) is associated with its
            previous node on the shortest path. If there is no previous node
            (e.g., for the source node or disconnected nodes), it is represented
            as null or not included in the map.
          </li>
        </ul>
        <h2 className="flex whitespace-pre-wrap" id="pseudocode">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Code example of the Algorithm
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
        <h2 id="playground" className="flex whitespace-pre-wrap">
          <a className="group relative border-none lg:-ml-2 lg:pl-2 no-underline">
            Playground - Visualization
          </a>
        </h2>
        <div className="pb-[300px]">
          <button
            type="button"
            onClick={() => {
              dijkstraRef.current?.reset();
            }}
            className="not-prose relative flex-none text-sm text-center font-semibold text-white py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-sky-500 dark:text-white focus:outline-none hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:highlight-white/20 dark:hover:bg-sky-400 dark:focus:ring-2 dark:focus:ring-sky-600 dark:focus:ring-offset-slate-900"
          >
            Reset
          </button>
          <DijkstraDemo
            ref={dijkstraRef}
            onNewBox={setBox}
            onNeedNext={setNeedNext}
            onRecapChange={setRecap}
            className="h-[300px] lg:h-[600px]"
          />
          <InfoBox
            onNext={() => {
              dijkstraRef.current?.next();
            }}
            nextable={needNext}
            className="min-h-[100px] mb-4 text-sm lg:text-base"
          >
            {box}
          </InfoBox>
          <div>{recap && <RecapDijkstraBox data={recap} />}</div>
        </div>
      </div>
    </MathJax.Provider>
  );
};

export default DijkstraContentPage;

interface RecapDijkstraBoxProps {
  className?: string;
  data: Map<
    Vertex,
    { finished: boolean; recap: [{ distance: number; previous?: Vertex }] }
  >;
}

const RecapDijkstraBox: React.FC<RecapDijkstraBoxProps> = (
  props: RecapDijkstraBoxProps
) => {
  const depth = Array.from(props.data.values()).reduce((acc, curr) => {
    return Math.max(acc, curr.recap.length);
  }, 0);
  let rows = [];
  let finishArray: boolean[] = [];
  for (let i = 0; i < depth; i++) {
    let map = new Map();
    for (const [vertex, value] of props.data) {
      if (value.finished) {
        finishArray.push(true);
      } else {
        finishArray.push(false);
      }
      map.set(vertex, value.recap[i]);
    }
    rows.push(map);
  }

  return (
    <div className="w-full rounded-lg bg-[#00ff0020] border-[1px] border-[#00ff0060]">
      <MathJax.Provider>
        <table className="table-fixed m-1">
          <thead>
            <tr>
              {Array.from(props.data.keys()).map((key) => (
                <th key={key.tag()} className="px-2 text-center">
                  {key.tag()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {Array.from(row.values()).map((value, i2) => {
                  const finished = finishArray[i2];
                  if (!value) {
                    return <td key={i2} className="px-2"></td>;
                  } else {
                    return (
                      <td
                        key={i2}
                        className={`px-2 text-center ${
                          finished ? "text-pink-400" : ""
                        }`}
                      >
                        <MathJax.Node
                          inline
                          formula={
                            value.distance === Infinity
                              ? String.raw`\infty`
                              : value.previous
                              ? String.raw`${
                                  value.distance
                                }_${value.previous?.tag()}`
                              : String.raw`${value.distance}`
                          }
                        />
                      </td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </MathJax.Provider>
    </div>
  );
};

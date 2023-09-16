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

const QuadTreeContentPage: React.FC<void> = () => {
  return <div className="flex flex-col items-center"></div>;
};

export default QuadTreeContentPage;

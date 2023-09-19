import { ReactElement } from "react";
import FruchtermanReingoldContentPage from "./graphs/Fruchterman-Reingold";
import QuadTreeContentPage from "./other/QuadTree";
import DijkstraContentPage from "./graphs/Dijkstra";

export const categories: Record<string, string> = {
  graphs: "Graphs",
  other: "Other",
};

export const DocPages: Record<
  keyof typeof categories,
  Record<
    string,
    {
      link: string;
      title: string;
      subtitle: string;
      content: ReactElement;
    }
  >
> = {
  graphs: {
    "fruchterman-reingold": {
      link: "/graphs/fruchterman-reingold",
      title: "Fruchterman-Reingold",
      subtitle: "Force-directed graph drawing algorithm",
      content: <FruchtermanReingoldContentPage />,
    },
    dijkstra: {
      link: "/graphs/dijkstra",
      title: "Dijkstra's Algorithm",
      subtitle: "Finding Shortest Paths in Weighted Graphs",
      content: <DijkstraContentPage />,
    },
  },
  other: {
    quadtree: {
      link: "/other/quadtree",
      title: "Quadtree",
      subtitle: "Hierarchical Spatial Data Structure",
      content: <QuadTreeContentPage />,
    },
  },
};

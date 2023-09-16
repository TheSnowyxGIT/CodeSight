import { ReactElement } from "react";
import FruchtermanReingoldContentPage from "./graphs/Fruchterman-Reingold";

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
    "dijskra-search": {
      link: "/graphs/dijskra-search",
      title: "Dijsktra-serach",
      subtitle:
        "Id sunt laboris aute eiusmod non et reprehenderit et labore elit reprehenderit.",
      content: <div />,
    },
  },
  other: {
    quadtree: {
      link: "/other/quadtree",
      title: "Quadtree",
      subtitle: "todo",
      content: <div />,
    },
  },
};

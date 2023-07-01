import { Graph } from "../../graph";

export const longestPath = (g: Graph) => {
    const visited: Record<string, boolean> = {};
  
    const dfs = (v: string) => {
      const label = g.node(v)!;
      if (!label) return 0;
      if (visited[v]) {
        return label.rank!;
      }
      visited[v] = true;
  
      let rank: number;
  
      g.outEdges(v)?.forEach(
        (edgeObj) => {
          const wRank = dfs(edgeObj.w);
          const minLen = g.edge(edgeObj)!.minlen!;
          const r = wRank - minLen;
          if (r) {
            if (rank === undefined || r < rank) {
              rank = r;
            }
          }
        }
      );
  
  
      if (!rank!) {
        rank = 0;
      }
  
      label.rank = rank;
      return rank;
    };
  
    g.sources()?.forEach((source) => dfs(source));
  };
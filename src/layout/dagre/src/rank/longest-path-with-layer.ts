import { Graph } from "../../graph";

export const longestPathWithLayer = (g: Graph) => {
    // 用longest path，找出最深的点
    const visited: Record<string, boolean> = {};
    let minRank: number;
  
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
  
          // NOTE: r可能为负
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
  
      if (minRank === undefined || rank < minRank) {
        minRank = rank;
      }
  
      // NOTE: node.rank
      label.rank = rank;
      console.log(v + '.rank=' + rank);
      return rank;
    };
  
    g.sources()?.forEach((source) => {
      if (g.node(source)) dfs(source);
    });
  
    if (minRank! === undefined) {
      minRank = 0;
    }
  
    // minRank += 1; // NOTE: 最小的层级是dummy root，+1
  
    // forward一遍，赋值层级
    const forwardVisited: Record<string, boolean> = {};
    const dfsForward = (v: string, nextRank: number) => {
      const label = g.node(v)!;
  
      const currRank = (
        !isNaN(label.layer as number) ? label.layer : nextRank
      ) as number;
  
      // 没有指定，取最大值
      if (label.rank === undefined || label.rank < currRank) {
        label.rank = currRank;
      }
  
      if (forwardVisited[v]) return;
      forwardVisited[v] = true;
  
      // DFS遍历子节点
      g.outEdges(v)?.map((e) => {
        dfsForward(e.w, currRank + g.edge(e)!.minlen!);
      });
    };
  
    // 指定层级的，更新下游
    g.nodes().forEach((n) => {
      const label = g.node(n)!;
      if(!label) return;
      if (!isNaN(label.layer as number)) {
        dfsForward(n, label.layer as number); // 默认的dummy root所在层的rank是-1
      } else {
        (label.rank as number) -= minRank;
      }
    });
  };
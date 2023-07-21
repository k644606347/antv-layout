import { Graph } from "../../graph";
import { max } from './math';

/*
 * Assigns an initial order value for each node by performing a DFS search
 * starting from nodes in the first rank. Nodes are assigned an order in their
 * rank as they are first visited.
 *
 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
 * Graphs."
 *
 * Returns a layering matrix with an array per layer and each layer sorted by
 * the order of its nodes.
 */
const initOrder = (g: Graph) => {
  const visited: Record<string, boolean> = {};

  // 子图相关
  // 找到所有的单一节点（没有子节点的节点）
  const simpleNodes = g.nodes().filter((v) => {
    return !g.children(v)?.length;
  });

  // 取最大rank
  const nodeRanks = simpleNodes.map((v) => (g.node(v)!.rank as number));
  const maxRank = max(nodeRanks);

  // 初始化layers，每级rank占一个数组项
  const layers: string[][] = [];
  if (typeof maxRank === 'number')
    for (let i = 0; i < maxRank + 1; i++) {
      layers.push([]);
    }

  // 通过深度优先遍历node，并将node赋值到layers[node.rank]上
  const dfs = (v: string) => {
    if (visited.hasOwnProperty(v)) return;
    visited[v] = true;
    const node = g.node(v)!;
    if (!isNaN(node.rank as number)) {
      layers[node.rank as number].push(v);
    }
    g.successors(v)?.forEach((child) => dfs(child as any));
  };

  // orderedVs按node.rank升序排列
  // 注意Array.sort不是纯函数，会变更array自身
  const orderedVs = simpleNodes.sort((a, b) => (g.node(a)!.rank as number) - (g.node(b)!.rank as number));
  // const orderedVs = _.sortBy(simpleNodes, function(v) { return g.node(v)!.rank; });

  // 有fixOrder的，直接排序好放进去
  const beforeSort = orderedVs.filter((n) => {
    return g.node(n)!.fixorder !== undefined;
  });

  // fixOrderNodes按node.fixorder升序排列
  const fixOrderNodes = beforeSort.sort((a, b) => (g.node(a)!.fixorder as number) - (g.node(b)!.fixorder as number));
  fixOrderNodes?.forEach((n) => {
    if (!isNaN(g.node(n)!.rank as number)) {
      layers[g.node(n)!.rank as number].push(n);
    }
    visited[n] = true;
  });

  orderedVs?.forEach(dfs);

  return layers;
};

export default initOrder;
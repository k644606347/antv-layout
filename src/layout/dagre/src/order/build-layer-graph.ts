import { Graph } from "../../graph";

/*
 * Constructs a graph that can be used to sort a layer of nodes. The graph will
 * contain all base and subgraph nodes from the request layer in their original
 * hierarchy and any edges that are incident on these nodes and are of the type
 * requested by the "relationship" parameter.
 *
 * Nodes from the requested rank that do not have parents are assigned a root
 * node in the output graph, which is set in the root graph attribute. This
 * makes it easy to walk the hierarchy of movable nodes during ordering.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG
 *    2. Base nodes in the input graph have a rank attribute
 *    3. Subgraph nodes in the input graph has minRank and maxRank attributes
 *    4. Edges have an assigned weight
 *
 * Post-conditions:
 *
 *    1. Output graph has all nodes in the movable rank with preserved
 *       hierarchy.
 *    2. Root nodes in the movable layer are made children of the node
 *       indicated by the root attribute of the graph.
 *    3. Non-movable nodes incident on movable nodes, selected by the
 *       relationship parameter, are included in the graph (without hierarchy).
 *    4. Edges incident on movable nodes, selected by the relationship
 *       parameter, are added to the output graph.
 *    5. The weights for copied edges are aggregated as need, since the output
 *       graph is not a multi-graph.
 */


/*

* Constructs a graph that can be used to sort a layer of nodes. The graph will contain all base and subgraph nodes from the request layer in their original hierarchy and any edges that are incident on these nodes and are of the type requested by the "relationship" parameter.

*

* Nodes from the requested rank that do not have parents are assigned a root node in the output graph, which is set in the root graph attribute. This makes it easy to walk the hierarchy of movable nodes during ordering.

*

* Pre-conditions:

*

* 1. Input graph is a DAG

* 2. Base nodes in the input graph have a rank attribute

* 3. Subgraph nodes in the input graph has minRank and maxRank attributes

* 4. Edges have an assigned weight

*

* Post-conditions:

*

* 1. Output graph has all nodes in the movable rank with preserved hierarchy.

* 2. Root nodes in the movable layer are made children of the node indicated by the root attribute of the graph.

* 3. Non-movable nodes incident on movable nodes, selected by the relationship parameter, are included in the graph (without hierarchy).

* 4. Edges incident on movable nodes, selected by the relationship parameter, are added to the output graph.

* 5. The weights for copied edges are aggregated as need, since the output graph is not a multi-graph.

*/

/*

 * Constructs a graph that can be used to sort a layer of nodes. The graph will contain all base and subgraph nodes from the request layer in their original hierarchy and any edges that are incident on these nodes and are of the type requested by the "relationship" parameter.

 *

 * Nodes from the requested rank that do not have parents are assigned a root node in the output graph, which is set in the root graph attribute. This makes it easy to walk the hierarchy of movable nodes during ordering.

 *

 * Pre-conditions:

 *

 *    1. Input graph is a DAG

 *    2. Base nodes in the input graph have a rank attribute

 *    3. Subgraph nodes in the input graph has minRank and maxRank attributes

 *    4. Edges have an assigned weight

 *

 * Post-conditions:

 *

 *    1. Output graph has all nodes in the movable rank with preserved hierarchy.

 *    2. Root nodes in the movable layer are made children of the node indicated by the root attribute of the graph.

 *    3. Non-movable nodes incident on movable nodes, selected by the relationship parameter, are included in the graph (without hierarchy).

 *    4. Edges incident on movable nodes, selected by the relationship parameter, are added to the output graph.

 *    5. The weights for copied edges are aggregated as need, since the output graph is not a multi-graph.

 */

/*

*构造一个可用于对节点层进行排序的图。该图将包含原始层次结构中请求层的所有基图和子图节点，以及这些节点上出现的、属于“relationship”参数所请求类型的任何边。

*

*请求列组中没有父级的节点将在输出图中分配一个根节点，该根节点在根图属性中设置。这使得在排序过程中很容易遍历可移动节点的层次结构。

*

*先决条件：

*

*1。输入图是DAG

*2。输入图中的基本节点具有秩属性

*3。输入图中的子图节点具有minRank和maxRank属性

*4。边具有指定的权重

*

*岗位条件：

*

*1。输出图具有保留层次结构的可移动列中的所有节点。

*2。可移动层中的根节点是由图的根属性指示的节点的子节点。

*3。由关系参数选择的可移动节点上的不可移动节点包含在图中（没有层次结构）。

*4。由关系参数选择的可移动节点上入射的边将添加到输出图中。

*5。复制边的权重会根据需要进行聚合，因为输出图不是多重图。

*/
const buildLayerGraph = (
  g: Graph,
  rank: number,
  relationship: "inEdges" | "outEdges"
) => {
  const root = createRootNode(g);
  const result = new Graph({ compound: true })
    // 可以理解为graph的config
    .setGraph({ root })
    .setDefaultNodeLabel((v: string) => {
      return g.node(v)!;
    });
  // debugger;
  g.nodes().forEach((v) => {
    const node = g.node(v)!;
    const parent = g.parent(v);
    
    if (
      node.rank === rank ||
      ((node.minRank as number) <= rank && rank <= (node.maxRank as number))
    ) {
      result.setNode(v);
      result.setParent(v, parent || root);

      // This assumes we have only short edges!
      g[relationship](v)?.forEach((e) => {
        const u = e.v === v ? e.w : e.v;
        const edge = result.edgeFromArgs(u, v);
        console.log('result.edgeFromArgs(u, v)', edge)
        const weight = edge !== undefined ? edge.weight : 0;
        result.setEdge(u, v, { weight: g.edge(e)!.weight! + weight! });
      });

      // 子图相关
      if (node.hasOwnProperty("minRank")) {
        result.setNode(v, {
          borderLeft: node.borderLeft[rank],
          borderRight: node.borderRight[rank],
        });
      }
    }
  });

  return result;
};

const createRootNode = (g: Graph) => {
  let v;
  while (g.hasNode((v = `_root${Math.random()}`)));
  return v;
};

export default buildLayerGraph;

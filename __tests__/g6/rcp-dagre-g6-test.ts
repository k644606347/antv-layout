import { DagreLayout } from "../../src";
import { mock } from './mock';
import G6 from "@antv/g6";
import rcpScrollCanvas from './plugins/rcp-scroll-canvas';

G6.registerBehavior('rcp-scroll-canvas', rcpScrollCanvas)

describe("rcp dagre layout", () => {
  it("rcp dagre layout", () => {
    const layout = new DagreLayout();

    const mockData = mock(2);
    console.log('mockData', mockData)
    let originGraphData = mockData;
    let addGraphData = {
      nodes: [],
      edges: [],
    };

    // layout.updateCfg({
    //   rankdir: "LR",
    // });
    // layout.layout(originGraphData as any);
    const originGraph = JSON.parse(JSON.stringify(originGraphData));
    // const originGraph = {};
    // layout.layout(originGraph);
    // console.log(JSON.stringify(originGraph));

    // @ts-ignore: modified originGraph
    // expect(originGraph.nodes.find((n) => n.id === "a")._order).toBe(0);
    // @ts-ignore
    // expect(originGraph.nodes.find((n) => n.id === "b")._order).toBe(2);
    // @ts-ignore
    // expect(originGraph.nodes.find((n) => n.id === "c")._order).toBe(1);

    // {
      const div = document.createElement("div");
      div.style.background = '#ccc';
      document.body.appendChild(div);
      const btn1 = document.createElement("button");
      btn1.textContent = 'rerender';
      btn1.addEventListener('click', () => {
        const layout = new DagreLayout();
        layout.updateCfg({
          rankdir: "LR",
        });
        layout.layout(originGraphData as any);
        // const newGraph = {
        //   nodes: [...originGraphData.nodes, ...addGraphData.nodes],
        //   edges: [...originGraphData.edges, ...addGraphData.edges],
        // };
        // graph.read(newGraph);
      }, false)
      document.body.appendChild(btn1);

      console.time('G6 layout');
      console.time('G6 render');
      const graph = new G6.Graph({
        container: div,
        width: window.innerWidth - 50,
        height: window.innerHeight - 200,
        // fitView: true,
        fitCenter: true,
        modes: {
          default: [
            "drag-node", "drag-canvas", 
            // {
            //   type: 'scroll-canvas',
            //   // enableOptimize: true,
            // },
            {
              type: 'rcp-scroll-canvas',
              enableOptimize: true,
            }
          ],
        },
        layout: {
          type: 'dagre',
          // radial: true,
          rankdir: 'LR',
          nodesep: 20,
          ranksep: 20,
          controlPoints: true,
          workerEnabled: true,
          // workerScriptURL: 'https://s2-11773.kwimgs.com/kos/nlav11773/lib/layout/0.3.2/layout.min.js',
          // workerScriptURL: 'https://s2-11773.kwimgs.com/kos/nlav11773/temp/layout.min.js',
          // workerScriptURL: 'http://127.0.0.1:1234/layout.min.js',
          // rankdir: 'LR',
        },
        defaultEdge: {
          // type: 'polyline',
          // routeCfg: {
          //   simple: true,
          // },
          style: {
            endArrow: true,
          },
        },
      });

      graph.data(originGraph);
      graph.render();
      graph.on('afterlayout', () => {
        console.timeEnd('G6 layout');
      })
      graph.on('afterrender', () => {
        console.timeEnd('G6 render');
        graph.focusItem('mock_root')
      });
      (window as any).__graph = graph;
    // }

    // {
    //   const div = document.createElement("div");
    //   document.body.appendChild(div);
    //   const graph = new G6.Graph({
    //     container: div,
    //     width: 500,
    //     height: 500,
    //     modes: {
    //       default: ["drag-node", "zoom-canvas", "drag-canvas"],
    //     },
    //     defaultEdge: {
    //       style: {
    //         endArrow: true,
    //       },
    //     },
    //   });

    //   graph.data(newGraph);
    //   graph.render();
    // }

    // // should keep origin order
    // // @ts-ignore: modified newGraph
    // expect(newGraph.nodes.find((n) => n.id === "a")._order).toBe(0);
    // // @ts-ignore
    // expect(newGraph.nodes.find((n) => n.id === "b")._order).toBe(1);
    // // @ts-ignore
    // expect(newGraph.nodes.find((n) => n.id === "c")._order).toBe(2);
  });
});

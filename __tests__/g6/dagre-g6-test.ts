import { DagreLayout } from "../../src";
import { mock } from './mock';
import G6 from "@antv/g6";

const div = document.createElement("div");
div.id = "global-spec";
document.body.appendChild(div);

const data = {
  nodes: [
    {
      id: "0",
      label: "0",
    },
    {
      id: "1",
      label: "1",
    },
    {
      id: "2",
      label: "2",
      layer: 2,
    },
    {
      id: "3",
      label: "3",
      layer: 4,
    },
    {
      id: "4",
      label: "4",
    },
    {
      id: "5",
      label: "5",
    },
    {
      id: "6",
      label: "6",
    },
    {
      id: "7",
      label: "7",
    },
    {
      id: "8",
      label: "8",
    },
    {
      id: "9",
      label: "9",
    },
  ],
  edges: [
    {
      source: "0",
      target: "1",
    },
    {
      source: "0",
      target: "2",
    },
    {
      source: "1",
      target: "4",
    },
    {
      source: "0",
      target: "3",
    },
    {
      source: "3",
      target: "4",
    },
    {
      source: "4",
      target: "5",
    },
    {
      source: "4",
      target: "6",
    },
    {
      source: "5",
      target: "7",
    },
    {
      source: "5",
      target: "8",
    },
    {
      source: "8",
      target: "9",
    },
    {
      source: "2",
      target: "9",
    },
    {
      source: "3",
      target: "9",
    },
  ],
};

describe("dagre layout", () => {
  // it('dagre combo', () => {
  //   const comboData = {
  //     nodes: [
  //       {
  //         id: '0',
  //         label: '0',
  //       },
  //       {
  //         id: '1',
  //         label: '1',
  //       },
  //       {
  //         id: '2',
  //         label: '2',
  //       },
  //       {
  //         id: '3',
  //         label: '3',
  //       },
  //       {
  //         id: '4',
  //         label: '4',
  //         comboId: 'A',
  //       },
  //       {
  //         id: '5',
  //         label: '5',
  //         comboId: 'B',
  //       },
  //       {
  //         id: '6',
  //         label: '6',
  //         comboId: 'A',
  //       },
  //       {
  //         id: '7',
  //         label: '7',
  //         comboId: 'C',
  //       },
  //       {
  //         id: '8',
  //         label: '8',
  //         comboId: 'C',
  //       },
  //       {
  //         id: '9',
  //         label: '9',
  //         comboId: 'A',
  //       },
  //       {
  //         id: '10',
  //         label: '10',
  //         comboId: 'B',
  //       },
  //       {
  //         id: '11',
  //         label: '11',
  //         comboId: 'B',
  //       },
  //     ],
  //     edges: [
  //       {
  //         source: '0',
  //         target: '1',
  //       },
  //       {
  //         source: '0',
  //         target: '2',
  //       },
  //       {
  //         source: '1',
  //         target: '4',
  //       },
  //       {
  //         source: '0',
  //         target: '3',
  //       },
  //       {
  //         source: '3',
  //         target: '4',
  //       },
  //       {
  //         source: '2',
  //         target: '5',
  //       },
  //       {
  //         source: '1',
  //         target: '6',
  //       },
  //       {
  //         source: '1',
  //         target: '7',
  //       },
  //       {
  //         source: '3',
  //         target: '8',
  //       },
  //       {
  //         source: '3',
  //         target: '9',
  //       },
  //       {
  //         source: '5',
  //         target: '10',
  //       },
  //       {
  //         source: '5',
  //         target: '11',
  //       },
  //     ],
  //     combos: [
  //       {
  //         id: 'A',
  //         label: 'combo A',
  //         style: {
  //           fill: '#C4E3B2',
  //           stroke: '#C4E3B2',
  //         },
  //       },
  //       {
  //         id: 'B',
  //         label: 'combo B',
  //         style: {
  //           stroke: '#99C0ED',
  //           fill: '#99C0ED',
  //         },
  //       },
  //       {
  //         id: 'C',
  //         label: 'combo C',
  //         style: {
  //           stroke: '#eee',
  //           fill: '#eee',
  //         },
  //       },
  //     ],
  //   };
  //   const layout = new DagreLayout({
  //     sortByCombo: true,
  //     ranksep: 10,
  //     nodesep: 10,
  //   });
  //   layout.layout(comboData);
  //   console.log(comboData)
  //   expect(comboData.nodes[9].x < comboData.nodes[7].x).toBe(true);
  //   expect(comboData.nodes[8].x < comboData.nodes[5].x).toBe(true);
  // });
  // it("assign layer", () => {
  //   const layout = new DagreLayout({ edgeLabelSpace: true });
  //   console.log('layout', layout);
  //   layout.layout(data);
  //   console.log(JSON.stringify(data));

  //   // const graph = new G6.Graph({
  //   //   container: div,
  //   //   width: 500,
  //   //   height: 500,
  //   //   modes: {
  //   //     default: ["drag-node", "zoom-canvas", "drag-canvas"],
  //   //   },
  //   //   defaultEdge: {
  //   //     style: {
  //   //       endArrow: true,
  //   //     },
  //   //   },
  //   // });

  //   // graph.data(data);
  //   // graph.render();
  // });
  // it("keep data order", () => {
  //   const div = document.createElement("div");
  //   document.body.appendChild(div);
  //   const layout = new DagreLayout();

  //   const data = {
  //     nodes: [
  //       {
  //         id: "0",
  //         label: "0",
  //       },
  //       {
  //         id: "1",
  //         label: "1",
  //       },
  //       {
  //         id: "2",
  //         label: "2",
  //       },
  //       {
  //         id: "4",
  //         label: "4",
  //       },
  //       {
  //         id: "3",
  //         label: "3",
  //       },
  //       {
  //         id: "5",
  //         label: "5",
  //       },
  //       {
  //         id: "6",
  //         label: "6",
  //       },
  //     ],
  //     edges: [
  //       {
  //         source: "0",
  //         target: "1",
  //       },
  //       {
  //         source: "0",
  //         target: "2",
  //       },
  //       {
  //         source: "1",
  //         target: "3",
  //       },
  //       {
  //         source: "2",
  //         target: "4",
  //       },
  //       {
  //         source: "3",
  //         target: "5",
  //       },
  //       {
  //         source: "4",
  //         target: "6",
  //       },
  //     ],
  //   };

  //   layout.updateCfg({
  //     keepNodeOrder: true,
  //     nodeOrder: data.nodes.map((n) => n.id),
  //   });
  //   layout.layout(data);
  //   // console.log(JSON.stringify(data));

  //   // const graph = new G6.Graph({
  //   //   container: div,
  //   //   width: 500,
  //   //   height: 500,
  //   //   modes: {
  //   //     default: ["drag-node", "zoom-canvas", "drag-canvas"],
  //   //   },
  //   //   defaultEdge: {
  //   //     style: {
  //   //       endArrow: true,
  //   //     },
  //   //   },
  //   // });

  //   // graph.data(data);
  //   // graph.render();
  // });

  it("increment layout", () => {
    const layout = new DagreLayout();

    const mockData = mock(1);
    console.log('mockData', mockData)
    let originGraphData = mockData;
    let addGraphData = {
      nodes: [],
      edges: [],
    };

    layout.updateCfg({
      rankdir: "LR",
    });
    layout.layout(originGraphData as any);
    // const originGraph = JSON.parse(JSON.stringify(originGraphData));
    const originGraph = {};
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
        // width: 500,
        height: 500,
        fitView: true,
        // fitCenter: true,
        modes: {
          default: ["drag-node", "drag-canvas", 'scroll-canvas'],
        },
        layout: {
          type: 'dagre',
          workerEnabled: true,
          // workerScriptURL: 'http://127.0.0.1:1234/layout.min.js',
          rankdir: 'LR',
        },
        defaultEdge: {
          // type: 'polyline',
          // routeConfig: {
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
      })
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

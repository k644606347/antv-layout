import { DagreLayout } from "../../src";
import { addLabel, errorData, mock, mockCyclic, mockLongestPath, mockTightTree } from './mock';
import G6, { GraphOptions } from "@antv/g6";
import rcpScrollCanvas from './plugins/rcp-scroll-canvas';
import { cloneDeep, mergeWith } from 'lodash';
import './test-node';

G6.registerBehavior('rcp-scroll-canvas', rcpScrollCanvas)
document.documentElement.setAttribute('style', 'height: 100%; margin: 0; paddding: 0;')
document.body.setAttribute('style', 'height: 100%; margin: 0; paddding: 0; display: flex; flex-direction: column;')
describe("dagre layout", () => {
  it("dagre rank", () => {
    const layout = new DagreLayout();
    (window as any).__layout = layout;


    // const mockData = mockCyclic(3);
    // const mockData = mockTightTree();
    const mockData = mockLongestPath();
    // const mockData = errorData()
    addLabel(mockData)
    console.log('mockData', mockData)
    let originGraphData = mockData;
    let addGraphData = {
      nodes: [],
      edges: [],
    };

    layout.updateCfg({
      // rankdir: "LR",
      ranker: 'network-simplex',
    });
    layout.layout(originGraphData as any);
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

    const btn1 = document.createElement("button");
    btn1.textContent = 'relayout';
    btn1.addEventListener('click', () => {
      const layout = new DagreLayout();
      layout.updateCfg({
        // rankdir: "LR",
        ranker: 'network-simplex'
      });
      layout.layout(originGraphData as any);
      // const newGraph = {
      //   nodes: [...originGraphData.nodes, ...addGraphData.nodes],
      //   edges: [...originGraphData.edges, ...addGraphData.edges],
      // };
      // graph.read(newGraph);
    })
    document.body.appendChild(btn1);

    const mainEl = document.createElement("div");
    document.body.appendChild(mainEl);
    mainEl.setAttribute('id', 'mainEl');
    mainEl.setAttribute('style', 'display: flex; flex: 1 1 auto;');

    renderByG6(cloneDeep(originGraphData), {
      layout: {
        ranker: 'longest-path',
      }
    });

    renderByG6(cloneDeep(originGraphData), {
      layout: {
        ranker: 'tight-tree'
      }
    });

    renderByG6(cloneDeep(originGraphData), {
      layout: {
        ranker: 'network-simplex'
      }
    });
  });


  function renderByG6(data: any, config?: Partial<GraphOptions>, container = document.createElement("div"),) {
    const btns = document.createElement("button");
    btns.textContent = 'render by g6';
    btns.addEventListener('click', () => {
      destroy();
      renderByG6(data, config, container);
    })
    container.appendChild(btns);
    container.setAttribute('style', 'width: 33%; height: 100%; border: 5px solid white;')
    const mainEl = document.querySelector('#mainEl')!;
    if (![...mainEl.childNodes].find(n => n === container)) {
      mainEl.appendChild(container);
    }

    const div = document.createElement("div");
    div.style.background = '#ccc';
    container.appendChild(div);
    console.time('G6 layout');
    console.time('G6 render');
    const defaultConfig: GraphOptions = {
      container: div,
      width: container.clientWidth,
      height: container.clientHeight - 50,
      // fitView: true,
      fitCenter: true,
      modes: {
        default: [
          "drag-node", "drag-canvas",
          "scroll-canvas"
          // {
          //   type: 'scroll-canvas',
          //   // enableOptimize: true,
          // },
          // {
          //   type: 'rcp-scroll-canvas',
          //   enableOptimize: true,
          // }
        ],
      },
      layout: {
        type: 'dagre',
        // radial: true,
        rankdir: 'TB',
        // ranker: 'network-simplex',
        // ranker: 'tight-tree',
        // ranker: 'longest-path',
        nodesep: 10,
        ranksep: 10,
        controlPoints: true,
        workerEnabled: true,
        // workerScriptURL: 'https://s2-11773.kwimgs.com/kos/nlav11773/lib/layout/0.3.2/layout.min.js',
        // workerScriptURL: 'https://s2-11773.kwimgs.com/kos/nlav11773/temp/layout.min.js',
        workerScriptURL: 'http://127.0.0.1:1234/layout.min.js',
        // rankdir: 'LR',
      },
      defaultNode: {
        type: 'test-node'
      },
      defaultEdge: {
        type: 'line',
        // type: 'cubic-horizontal',
        // type: 'cubic-vertical',
        // type: 'polyline',
        // routeCfg: {
        //   simple: true,
        // },
        style: {
          stroke: '#326BFB',
          radius: 5,
          endArrow: {
            path: G6.Arrow.triangle(),
            stroke: 'green',
            fill: 'green'
          },
        },
      },
    }

    const finalConfig = mergeWith(defaultConfig, config, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return srcValue;
      }
    })
    const rankerEl = document.createElement('div')
    rankerEl.innerHTML = `ranker=${finalConfig.layout?.ranker || 'default[tight-tree]' }`
    rankerEl.setAttribute('style', 'color: green; padding: 0 5px;')
    container.appendChild(rankerEl)
    const graph = new G6.Graph(finalConfig,);

    graph.data(data);
    graph.render();
    graph.on('afterlayout', () => {
      console.timeEnd('G6 layout');
    })
    graph.on('afterrender', () => {
      console.timeEnd('G6 render');
      graph.focusItem('mock_root')
    });
    (window as any).__graph = graph;

    window.onresize = () => {
      if (graph.get('destroyed')) {
        return;
      }
      graph.changeSize(container.scrollWidth, container.scrollHeight);
    };
    function destroy() {
      graph.destroy();
      [...container.childNodes].forEach(n => {
        container.removeChild(n)
      })
      // container.removeChild(btns);
      // container.removeChild(div);
    }
    return destroy;
  }
});

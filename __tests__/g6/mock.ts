import { NodeConfig, EdgeConfig } from '@antv/g6';

type IData = { edges: EdgeConfig[]; nodes: NodeConfig[]; }
export function mock(maxDepth = 5) {
    const rootId = 'mock_root';
    const mockNodesMap = new WeakMap();

    const nodeCountMap: Record<string, number> = {};
    function genNodeId(nodeDepth: number) {
        if (typeof nodeCountMap[nodeDepth] !== 'number') {
            nodeCountMap[nodeDepth] = 0;
        }
        return 'depth_' + String(nodeDepth) + '_' + (nodeCountMap[nodeDepth]++);
    }


    function makeMock(sources: string[], curDepth = 1) {
        let edges: EdgeConfig[] = [];
        let nodes: NodeConfig[] = [];

        if (curDepth > maxDepth) { return { edges, nodes }; }

        const nextSources: string[] = [];

        // if (sources.length > 0 && randomPick()) {
        // nextSources.push(sources[Math.floor(Math.random() * sources.length)]);
        // }

        sources.forEach((source, sourceIndex) => {
            if (!mockNodesMap[source]) {
                nodes.push(mockNodesMap[source] = {
                    id: source,
                    label: 'label_' + source,
                    color: "#fb9a99",
                });
            }

            let maxChildCount: number;
            if (curDepth <= 1) {
                maxChildCount = 5;
            } else if (curDepth === 2) {
                maxChildCount = 2;
            } else if (curDepth < 10) {
                maxChildCount = 2;
            } else if (curDepth === 10) {
                maxChildCount = 5;
                // } else if (curDepth <= 30) {
                //     maxChildCount = 2;
            } else {
                maxChildCount = randomPick() ? 2 : 0;
            }


            const len = maxChildCount;
            // const len = Math.round(Math.random() * maxChildCount);

            for (let index = 0; index < len;) {
                const useNewNode = true;
                const targetId = genNodeId(curDepth);
                // const useNewNode = index > 0 ? randomPick() : true;
                // TODO: 猜测这里 random可能导致形成环了，然后maximum call stack size
                // const targetId = useNewNode ? genNodeId(curDepth) : edges[Math.floor(Math.random() * edges.length)].target;
                if (useNewNode && mockNodesMap[targetId]) { continue; }
                edges.push({
                    source: String(source),
                    target: targetId,
                });
                nextSources.push(targetId);
                if (useNewNode) {
                    nodes.push(mockNodesMap[targetId] = {
                        id: targetId,
                        label: 'label_' + targetId,
                        color: "#fb9a99",
                    });
                }
                index++;
            }
        });

        const nextData = makeMock(nextSources, curDepth + 1);
        if (nextData) {
            edges = edges.concat(nextData.edges);
            nodes = nodes.concat(nextData.nodes);
        }

        return {
            edges,
            nodes,
        };
    }

    console.time('mockData');
    const mockData = makeMock([rootId]);
    // JSON.parse(JSON.stringify(makeMock([ rootId ])));
    // mockData.edges = mockData.edges.reverse();
    console.timeEnd('mockData');
    return mockData;
}


export function mockCyclic(depth: number) {
    const mockData = mock(depth);

    let len = mockData.nodes.length;
    mockData.edges.push({
        target: mockData.nodes[0].id,
        source: mockData.nodes[len - 1].id
    });

    return mockData;
}

export function mockTightTree(): IData {
    return {
        nodes: [{
            id: 'a'
        }, {
            id: 'b'
        }, {
            id: 'c'
        }, {
            id: 'd'
        }, {
            id: 'e'
        }, {
            id: 'f'
        }, {
            id: 'g'
        }, {
            id: 'h'
        }],
        edges: [{
            source: 'a',
            target: 'b'
        }, {
            source: 'a',
            target: 'e'
        }, {
            source: 'a',
            target: 'f'
        }, {
            source: 'e',
            target: 'g'
        }, {
            source: 'f',
            target: 'g'
        }, {
            source: 'c',
            target: 'd'
        }, {
            source: 'g',
            target: 'h'
        }, {
            source: 'd',
            target: 'h'
        }, {
            source: 'b',
            target: 'c'
        }]
    }
}

export function mockLongestPath(): IData {
    return {
        nodes: [
            {
                id: 'a'
            }
            , {
                id: 'a2'
            }
            , {
                id: 'a3'
            }
            , {
                id: 'b'
            }, {
                id: 'c'
            }, {
                id: 'd'
            }, {
                id: 'e'
            }, {
                id: 'f'
            }, {
                id: 'g'
            }, {
                id: 'h'
            }
            , {
                id: 'i'
            }
            , {
                id: 'j'
            }
            , {
                id: 'k'
            }
        ],
        edges: [{
            source: 'a',
            target: 'b'
        }, {
            source: 'a',
            target: 'c'
        }, {
            source: 'a',
            target: 'd'
        }, {
            source: 'b',
            target: 'e'
        }
            , {
            source: 'f',
            target: 'g'
        }
            , {
            source: 'c',
            target: 'e'
        }
            , {
            source: 'g',
            target: 'h'
        }
            , {
            source: 'd',
            target: 'f'
        }
            , {
            source: 'a',
            target: 'f'
        }
            , {
            source: 'e',
            target: 'i'
        }
            , {
            source: 'h',
            target: 'i'
        }
            , {
            source: 'a2',
            target: 'a3'
        }
            , { source: 'f', target: 'a' }
            , {
            source: 'a3',
            target: 'j'
        }
            , {
            source: 'a',
            target: 'j'
        }
            , {
            source: 'j',
            target: 'k'
        }
            // ,{
            //     source: 'i',
            //     target: 'k'
            // }
        ]
    }
}

export function addLabel(data: IData) {
    data.nodes.forEach(n => {
        if (n.label === undefined) {
            n.label = n.id
        }
    })
    // data.nodes.reverse();
    // data.edges.reverse();
    return data;
}

function randomPick() {
    return Math.floor(Math.random() * 10) > 4;
}

export function errorData() {
    const layoutData = {
        "nodes": [
            {
                "id": "1",
                "shape": "rect",
                "width": 100,
                "height": 40,
                "attrs": {
                    "body": {
                        "fill": "#1E90FF",
                        "stroke": "#FF4500"
                    },
                    "label": {
                        "text": "start",
                        "fill": "#000000",
                        "fontSize": 13
                    }
                },
                "x": 35,
                "y": 55,
                "_order": 0
            },
            {
                "id": "3",
                "shape": "rect",
                "width": 100,
                "height": 40,
                "attrs": {
                    "body": {
                        "fill": "#FFFF00",
                        "stroke": "#87CEFA"
                    },
                    "label": {
                        "text": "hr_review",
                        "fill": "#000000",
                        "fontSize": 13
                    }
                },
                "x": 140,
                "y": 635,
                "_order": 1
            },
            {
                "id": "2",
                "shape": "rect",
                "width": 100,
                "height": 40,
                "attrs": {
                    "body": {
                        "fill": "#00FF00",
                        "stroke": "#FF4500"
                    },
                    "label": {
                        "text": "first_review",
                        "fill": "#000000",
                        "fontSize": 13
                    }
                },
                "x": 35,
                "y": 200,
                "_order": 0
            },
            {
                "id": "4",
                "shape": "rect",
                "width": 100,
                "height": 40,
                "attrs": {
                    "body": {
                        "fill": "#00FF00",
                        "stroke": "#FF4500"
                    },
                    "label": {
                        "text": "engineer_manager_review",
                        "fill": "#000000",
                        "fontSize": 13
                    }
                },
                "x": 35,
                "y": 490,
                "_order": 0
            },
            {
                "id": "5",
                "shape": "rect",
                "width": 100,
                "height": 40,
                "attrs": {
                    "body": {
                        "fill": "#FFFF00",
                        "stroke": "#FF4500"
                    },
                    "label": {
                        "text": "engineering_director_review",
                        "fill": "#000000",
                        "fontSize": 13
                    }
                },
                "x": 35,
                "y": 635,
                "_order": 0
            },
            {
                "id": "6",
                "shape": "rect",
                "width": 100,
                "height": 40,
                "attrs": {
                    "body": {
                        "fill": "#FFFFFF",
                        "stroke": "#FF4500"
                    },
                    "label": {
                        "text": "sales_review",
                        "fill": "#000000",
                        "fontSize": 13
                    }
                },
                "x": 120,
                "y": 345,
                "_order": 1
            },
            {
                "id": "7",
                "shape": "rect",
                "width": 100,
                "height": 40,
                "attrs": {
                    "body": {
                        "fill": "#FFFFFF",
                        "stroke": "#FF4500"
                    },
                    "label": {
                        "text": "finance_review",
                        "fill": "#000000",
                        "fontSize": 13
                    }
                },
                "x": 120,
                "y": 490,
                "_order": 1
            }
        ],
        "edges": [
            {
                "source": "1",
                "target": "2",
                "router": {
                    "name": "metro",
                    "args": {
                        "padding": 1,
                        "startDirections": [
                            "bottom"
                        ],
                        "endDirections": [
                            "top"
                        ]
                    }
                },
                "connector": {
                    "name": "rounded",
                    "args": {
                        "radius": 8
                    }
                },
                "anchor": "center",
                "connectionPoint": "anchor",
                "allowBlank": false,
                "snap": {
                    "radius": 20
                },
                "attrs": {
                    "line": {
                        "stroke": "#1890ff",
                        "strokeDasharray": 10,
                        "targetMarker": "classic",
                        "style": {
                            "animation": "ant-line 30s infinite linear"
                        }
                    }
                },
                "shape": "edge"
            },
            {
                "source": "2",
                "target": "4",
                "router": {
                    "name": "metro",
                    "args": {
                        "padding": 1,
                        "startDirections": [
                            "bottom"
                        ],
                        "endDirections": [
                            "top"
                        ]
                    }
                },
                "connector": {
                    "name": "rounded",
                    "args": {
                        "radius": 8
                    }
                },
                "anchor": "center",
                "connectionPoint": "anchor",
                "allowBlank": false,
                "snap": {
                    "radius": 20
                },
                "attrs": {
                    "line": {
                        "stroke": "#1890ff",
                        "strokeDasharray": 10,
                        "targetMarker": "classic",
                        "style": {
                            "animation": "ant-line 30s infinite linear"
                        }
                    }
                },
                "shape": "edge"
            },
            {
                "source": "2",
                "target": "6",
                "router": {
                    "name": "metro",
                    "args": {
                        "padding": 1,
                        "startDirections": [
                            "bottom"
                        ],
                        "endDirections": [
                            "top"
                        ]
                    }
                },
                "connector": {
                    "name": "rounded",
                    "args": {
                        "radius": 8
                    }
                },
                "anchor": "center",
                "connectionPoint": "anchor",
                "allowBlank": false,
                "snap": {
                    "radius": 20
                },
                "attrs": {
                    "line": {
                        "stroke": "#1890ff",
                        "strokeDasharray": 10,
                        "targetMarker": "classic",
                        "style": {
                            "animation": "ant-line 30s infinite linear"
                        }
                    }
                },
                "shape": "edge"
            },
            {
                "source": "4",
                "target": "5",
                "router": {
                    "name": "metro",
                    "args": {
                        "padding": 1,
                        "startDirections": [
                            "bottom"
                        ],
                        "endDirections": [
                            "top"
                        ]
                    }
                },
                "connector": {
                    "name": "rounded",
                    "args": {
                        "radius": 8
                    }
                },
                "anchor": "center",
                "connectionPoint": "anchor",
                "allowBlank": false,
                "snap": {
                    "radius": 20
                },
                "attrs": {
                    "line": {
                        "stroke": "#1890ff",
                        "strokeDasharray": 10,
                        "targetMarker": "classic",
                        "style": {
                            "animation": "ant-line 30s infinite linear"
                        }
                    }
                },
                "shape": "edge"
            },
            {
                "source": "4",
                "target": "3",
                "router": {
                    "name": "metro",
                    "args": {
                        "padding": 1,
                        "startDirections": [
                            "bottom"
                        ],
                        "endDirections": [
                            "top"
                        ]
                    }
                },
                "connector": {
                    "name": "rounded",
                    "args": {
                        "radius": 8
                    }
                },
                "anchor": "center",
                "connectionPoint": "anchor",
                "allowBlank": false,
                "snap": {
                    "radius": 20
                },
                "attrs": {
                    "line": {
                        "stroke": "#1890ff",
                        "strokeDasharray": 10,
                        "targetMarker": "classic",
                        "style": {
                            "animation": "ant-line 30s infinite linear"
                        }
                    }
                },
                "shape": "edge"
            },
            {
                "source": "6",
                "target": "7",
                "router": {
                    "name": "metro",
                    "args": {
                        "padding": 1,
                        "startDirections": [
                            "bottom"
                        ],
                        "endDirections": [
                            "top"
                        ]
                    }
                },
                "connector": {
                    "name": "rounded",
                    "args": {
                        "radius": 8
                    }
                },
                "anchor": "center",
                "connectionPoint": "anchor",
                "allowBlank": false,
                "snap": {
                    "radius": 20
                },
                "attrs": {
                    "line": {
                        "stroke": "#1890ff",
                        "strokeDasharray": 10,
                        "targetMarker": "classic",
                        "style": {
                            "animation": "ant-line 30s infinite linear"
                        }
                    }
                },
                "shape": "edge"
            },
            {
                "source": "7",
                "target": "5",
                "router": {
                    "name": "metro",
                    "args": {
                        "padding": 1,
                        "startDirections": [
                            "bottom"
                        ],
                        "endDirections": [
                            "top"
                        ]
                    }
                },
                "connector": {
                    "name": "rounded",
                    "args": {
                        "radius": 8
                    }
                },
                "anchor": "center",
                "connectionPoint": "anchor",
                "allowBlank": false,
                "snap": {
                    "radius": 20
                },
                "attrs": {
                    "line": {
                        "stroke": "#1890ff",
                        "strokeDasharray": 10,
                        "targetMarker": "classic",
                        "style": {
                            "animation": "ant-line 30s infinite linear"
                        }
                    }
                },
                "shape": "edge"
            }
        ]
    }
    return layoutData;
}
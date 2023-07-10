import G6 from "@antv/g6";
const ERROR_COLOR = '#F5222D';
const getNodeConfig = (node) => {
    if (node.nodeError) {
        return {
            basicColor: ERROR_COLOR,
            fontColor: '#FFF',
            borderColor: ERROR_COLOR,
            bgColor: '#E66A6C',
        };
    }
    let config = {
        basicColor: '#5B8FF9',
        fontColor: '#5B8FF9',
        borderColor: '#5B8FF9',
        bgColor: '#C6E5FF',
    };
    switch (node.type) {
        case 'root': {
            config = {
                basicColor: '#E3E6E8',
                fontColor: 'rgba(0,0,0,0.85)',
                borderColor: '#E3E6E8',
                bgColor: '#5b8ff9',
            };
            break;
        }
        default:
            break;
    }
    return config;
};

G6.registerNode('test-node', {
    shapeType: 'rect',
    draw(cfg, group) {
        // console.log('cfg', cfg)
        const size = {
            width: 30,
            height: 30,
        }
        const rect = group!.addShape('rect', {
            attrs: {
                ...size,
                fill: '#E3E6E8',
                stroke: '#326BFB',
            },
        });
        group!.addShape('text', {
            attrs: {
                x: size.width / 2,
                y: size.height / 2,
                stroke: '#000',
                text: cfg!.label,
                textAlign: 'center',
                textBaseline: 'middle',
            },
            name: 'text1',
            modelId: 'text1-' + cfg!.id,
        });
        return rect;
    },
    getAnchorPoints() {
        return [
            [0.5, 0],
            [0.5, 1],
            [0, 0.5],
            [1, 0.5],
        ];
    },
}, 'rect');

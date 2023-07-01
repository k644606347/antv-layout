/* eslint-disable complexity */
// @ts-nocheck
import { IBBox, IG6GraphEvent } from '@antv/g6-core';
import { isBoolean, isObject } from '@antv/util';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import { getGroupsBBoxMap, calcVisibleArea, edgeGroupNeedHide, inVisibleArea, resetProto } from './scroll-optimize';
import { defineBehaviorBase } from './defineBehaviorOption';
import { IGroup } from '@antv/g6';

const ALLOW_EVENTS = [ 'shift', 'ctrl', 'alt', 'control', 'meta' ];

const base = defineBehaviorBase({
    direction: 'both',
    enableOptimize: false,
    zoomKey: 'ctrl',
    // scroll-canvas 可滚动的扩展范围，默认为 0，即最多可以滚动一屏的位置
    // 当设置的值大于 0 时，即滚动可以超过一屏
    // 当设置的值小于 0 时，相当于缩小了可滚动范围
    // 具体实例可参考：https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*IFfoS67_HssAAAAAAAAAAAAAARQnAQ
    scalableRange: 0,
    allowDragOnItem: true,
});

type IBase = typeof base;
interface IRcpScrollCanvas extends IBase {
    getEvents(): { wheel: 'onWheel' };
    optimizeConfig: {
        offsetUnit: number,
    }
    prevCanvasBBox: IBBox | null,
    bboxCacheMap: Map<string, IBBox> | null,
    getGroupsBBoxMap(): Map<string, IBBox>;
    updateBBoxCache(x: number, y: number): void;
    onWheel(ev: IG6GraphEvent): void;
    processOptimize(translateInfo: any): void;
    afterProcessOptimize(): void;
    allowDrag(evt: IG6GraphEvent): boolean;
}

const rcpScrollCanvas: IRcpScrollCanvas = {
    ...base,

    getEvents() {
        if (!this.zoomKey || ALLOW_EVENTS.indexOf(this.zoomKey) === -1) { this.zoomKey = 'ctrl'; }
        return {
            wheel: 'onWheel',
        };
    },
    prevCanvasBBox: null,
    bboxCacheMap: null,
    optimizeConfig: {
        offsetUnit: 50,
    },

    getGroupsBBoxMap() {
        let cache = this.bboxCacheMap;
        if (cache) {
            return cache;
        }

        const { bboxMap } = getGroupsBBoxMap(this.graph!.get('canvas'));
        this.bboxCacheMap = cache = bboxMap;

        return bboxMap;
    },
    updateBBoxCache(x: number, y: number) {
        this.bboxCacheMap?.forEach(bbox => {
            bbox.x += x; bbox.minX += x; bbox.maxX += x;
            bbox.y += y; bbox.minY += y; bbox.maxY += y;
        });
    },
    onWheel(ev: IG6GraphEvent) {
        if (!this.allowDrag(ev)) { return; }
        const graph = this.graph;

        // resetProto(graph);

        const zoomKeys = [ this.zoomKey ];
        const translateInfo = { x: 0, y: 0, direction: { x: '', y: '' } };
        if (zoomKeys.includes('control')) { zoomKeys.push('ctrl'); }
        const keyDown = zoomKeys.some(ele => ev[`${ele}Key`]);
        if (keyDown) {
            const canvas = graph.get('canvas');
            const point = canvas.getPointByClient(ev.clientX, ev.clientY);
            let ratio = graph.getZoom();
            if (ev.wheelDelta > 0) {
                ratio = ratio + ratio * 0.05;
            } else {
                ratio = ratio - ratio * 0.05;
            }
            graph.zoomTo(ratio, {
                x: point.x,
                y: point.y,
            });
        } else {
            let dx = (ev.deltaX || ev.movementX) as number;
            let dy = (ev.deltaY || ev.movementY) as number;

            if (!dy && navigator.userAgent.indexOf('Firefox') > -1) { dy = (-ev.wheelDelta * 125) / 3; }

            const width = this.graph.get('width');
            const height = this.graph.get('height');

            let expandWidth = this.scalableRange;
            let expandHeight = this.scalableRange;
            // 若 scalableRange 是 0~1 的小数，则作为比例考虑
            if (expandWidth < 1 && expandWidth > -1) {
                expandWidth = width * expandWidth;
                expandHeight = height * expandHeight;
            }

            const bboxMap = this.getGroupsBBoxMap();
            const graphCanvasBBox = bboxMap.get('-root')!;
            const { minX, maxX, minY, maxY } = graphCanvasBBox;


            if (dx > 0) {
                if (maxX < -expandWidth) {
                    dx = 0;
                } else if (maxX - dx < -expandWidth) {
                    dx = maxX + expandWidth;
                }
            } else if (dx < 0) {
                if (minX > width + expandWidth) {
                    dx = 0;
                } else if (minX - dx > width + expandWidth) {
                    dx = minX - (width + expandWidth);
                }
            }

            if (dy > 0) {
                if (maxY < -expandHeight) {
                    dy = 0;
                } else if (maxY - dy < -expandHeight) {
                    dy = maxY + expandHeight;
                }
            } else if (dy < 0) {
                if (minY > height + expandHeight) {
                    dy = 0;
                } else if (minY - dy > height + expandHeight) {
                    dy = minY - (height + expandHeight);
                }
            }

            if (this.get('direction') === 'x') {
                dy = 0;
            } else if (this.get('direction') === 'y') {
                dx = 0;
            }

            const x = translateInfo.x = dx === 0 ? dx : -dx;
            const y = translateInfo.y = dy === 0 ? dy : -dy;
            if (x !== 0) {
                translateInfo.direction.x = x > 0 ? 'L' : 'R';
            }
            if (y !== 0) {
                translateInfo.direction.y = y > 0 ? 'T' : 'B';
            }
            // console.log('x,y', x, y)
            this.updateBBoxCache(x, y);
            this.processOptimize(translateInfo);
            graph.translate(translateInfo.x, translateInfo.y);
            // graph.getNodes().forEach(node => {
            //     if (node.get<IGroup>('group').get('visible')) {node.get<IGroup>('group').translate(translateInfo.x, translateInfo.y);}
            // });
            // graph.getEdges().forEach(edge => {
            //     if (edge.get<IGroup>('group').get('visible')) {edge.get<IGroup>('group').translate(translateInfo.x, translateInfo.y);}
            // });
            this.afterProcessOptimize();
        }
        ev.preventDefault();
    },
    processOptimize(translateInfo: any) {
        const graph = this.graph;
        const bboxMap = this.getGroupsBBoxMap();
        const graphCanvasBBox = bboxMap.get('-root')!;
        const enableOptimize = this.get('enableOptimize');


        if (!enableOptimize) {
            return;
        }

        const prevCanvasBBox = this.prevCanvasBBox;
        const { offsetUnit } = this.optimizeConfig;
        const offsetIsOverLength = prevCanvasBBox === null ? true : (
            Math.abs(Math.abs(prevCanvasBBox.x) - Math.abs(graphCanvasBBox.x)) > offsetUnit
      || Math.abs(Math.abs(prevCanvasBBox.y) - Math.abs(graphCanvasBBox.y)) > offsetUnit
        );

        if (!offsetIsOverLength) {
            return;
        }

        const canvasRect = graph.get('canvas').get('el').getBoundingClientRect();
        const visibleArea = calcVisibleArea(canvasRect, {
            width: canvasRect.width,
            height: canvasRect.height,
        }, translateInfo.direction);


        let nodeOptimized: boolean | undefined = this.get('nodeOptimized');

        // hiding
        // if (!nodeOptimized) {
        // console.time('nodeOptimized');
        const nodes = graph.getNodes();
        const nodeLen = nodes.length;
        for (let i = 0; i < nodeLen; i++) {
            const node = nodes[i];
            if (node.destroyed) { continue; }
            const group = node.get<IGroup>('group');
            const bbox = bboxMap.get(group.cfg.id)!;
            const gNeedHide = !inVisibleArea(bbox, visibleArea);
            // console.log(gNeedHide, group.cfg.id, bbox, canvasRect.width, canvasRect.height, translateInfo)
            // console.log(gNeedHide, group.cfg.id);
            const groupIsVisible = group.get('visible');
            if (gNeedHide) {
                if (groupIsVisible) {
                    group.set('visible', false);
                    group.getChildren().forEach(child => {
                        if (child.get('visible')) {
                            child.set('visible', false);
                        }
                    });
                    nodeOptimized = true;
                }
            } else if (!groupIsVisible) {
                group.set('visible', true);
                group.getChildren().forEach(child => {
                    if (!child.get('visible')) {
                        child.set('visible', true);
                    }
                });
            }
        }
        // console.timeEnd('nodeOptimized');

        this.set('nodeOptimized', nodeOptimized);

        let edgeOptimized: boolean | undefined = this.get('edgeOptimized');
        // console.time('edgeOptimized');

        const edges = graph.getEdges();
        const edgeLen = edges.length;
        for (let i = 0; i < edgeLen; i++) {
            const edge = edges[i];
            if (edge.destroyed) { continue; }
            const group = edge.get<IGroup>('group');

            const bbox = bboxMap.get(group.cfg.id)!;
            const gNeedHide = edgeGroupNeedHide(bbox, visibleArea);
            const groupIsVisible = group.get('visible');
            if (gNeedHide) {
                if (groupIsVisible) {
                    group.set('visible', false);
                    group.getChildren().forEach(child => {
                        if (child.get('visible')) {
                            child.set('visible', false);
                        }
                    });
                    edgeOptimized = true;
                }
            } else if (!groupIsVisible) {
                group.set('visible', true);
                group.getChildren().forEach(child => {
                    if (!child.get('visible')) {
                        child.set('visible', true);
                    }
                });
            }
        }
        // console.timeEnd('edgeOptimized');

        this.set('edgeOptimized', edgeOptimized);
        this.prevCanvasBBox = cloneDeep(graphCanvasBBox);
    },
    afterProcessOptimize() {
        const nodeOptimized: boolean | undefined = this.get('nodeOptimized');
        if (nodeOptimized) {
            this.graph.getNodes().forEach(node => {
                const group = node.get<IGroup>('group');
                if (!group.get('visible')) {
                    group.show();
                    group.getChildren().forEach(child => {
                        child.show();
                    });
                }
            });
        }

        const edgeOptimized: boolean | undefined = this.get('edgeOptimized');
        if (edgeOptimized) {
            this.graph.getEdges().forEach(edge => {
                const group = edge.get<IGroup>('group');
                if (!group.get('visible')) {
                    group.show();
                    group.getChildren().forEach(child => {
                        child.show();
                    });
                }
            });
        }

        if (nodeOptimized || edgeOptimized) {
            // this.graph.translate(0, 0);
        }
        this.set('nodeOptimized', false);
        this.set('edgeOptimized', false);

        this.prevCanvasBBox = null;
        this.bboxCacheMap = null;
        console.log('afterProcess');
    },
    allowDrag(evt: IG6GraphEvent) {
        const target = evt.target;
        const targetIsCanvas = target && target.isCanvas && target.isCanvas();
        if (isBoolean(this.allowDragOnItem) && !this.allowDragOnItem && !targetIsCanvas) { return false; }
        if (isObject(this.allowDragOnItem)) {
            const { node, edge, combo } = this.allowDragOnItem as any;
            const itemType = evt.item?.getType?.();
            if (!node && itemType === 'node') { return false; }
            if (!edge && itemType === 'edge') { return false; }
            if (!combo && itemType === 'combo') { return false; }
        }
        return true;
    },
};
rcpScrollCanvas.afterProcessOptimize = debounce(rcpScrollCanvas.afterProcessOptimize, 2000);

export default rcpScrollCanvas;
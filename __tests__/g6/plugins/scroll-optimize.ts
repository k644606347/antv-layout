import { IBBox, IShape } from '@antv/g6';

export function nodeGroupNeedHide(bbox: IBBox, visibleArea: any) {
    return !inVisibleArea(bbox, visibleArea);
}

export function edgeGroupNeedHide(bbox: IBBox, visibleArea: any) {
    const itemInVisibleArea = inVisibleArea(bbox, visibleArea);

    if (!itemInVisibleArea) { return true; }

    const lengthScope = {
        w: visibleArea.width * 2,
        h: visibleArea.height * 2,
    };

    // 超长的edge，也选择隐藏，这里可以加个开关配置，根据场景设置
    const overlength = (bbox.maxX - bbox.minX > lengthScope.w) || (bbox.maxY - bbox.minY > lengthScope.h);
    if (overlength) {
        return true;
    }

    return false;
}

export function inVisibleArea(bbox: IBBox, visibleArea: Record<string, number>) {
    const xIsHidden = (bbox.maxX) <= visibleArea.minX || (bbox.minX) >= visibleArea.maxX;
    if (xIsHidden) { return false; }

    const yIsHidden = (bbox.maxY) <= visibleArea.minY || (bbox.minY) >= visibleArea.maxY;
    if (yIsHidden) { return false; }

    return true;
}

export function calcVisibleArea(canvasRect: Record<string, number>, bufferArea: Record<string, number>, direction: any) {
    const visibleArea = {
        minX: 0, maxX: canvasRect.width,
        minY: 0, maxY: canvasRect.height,
    };
    if (direction.x) {
        direction.x === 'L'
            ? (visibleArea.minX = 0 - bufferArea.width)
            : (visibleArea.maxX = canvasRect.width + bufferArea.width);
    }
    if (direction.y) {
        direction.y === 'T'
            ? (visibleArea.minY = 0 - bufferArea.height)
            : (visibleArea.maxY = canvasRect.height + bufferArea.height);
    }

    return visibleArea;
}

export function getGroupsBBoxMap(item: any) {
    const bboxMap = new Map<object, IBBox>();
    /** 位于画布的四个顶点上的图形 */
    const peakItems: { top: IShape, right: IShape, bottom: IShape, left: IShape } = {} as any;

    function _calcBBox(item: any) {
        const isCanvas = item.isCanvas ? item.isCanvas() : false;
        const isGroup = item.isGroup ? item.isGroup() : false;

        if (!isGroup && !isCanvas) {
            return item.getCanvasBBox();
        }

        const children = item.getChildren();
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        let count = 0;

        children.forEach(child => {
            const isGroup = child.isGroup();
            // const `isVisible = child.get('visible');
            if (
                // isVisible && 
                (
                    !isGroup || (isGroup && child.getChildren().length > 0)
                )
            ) {
                count++;
                const box = _calcBBox(child);

                if (typeof box.minX === 'number') {
                    minX = Math.min(minX, box.minX);
                    peakItems.left = child;
                }
                if (typeof box.maxX === 'number') {
                    maxX = Math.max(maxX, box.maxX);
                    peakItems.right = child;
                }
                if (typeof box.minY === 'number') {
                    minY = Math.min(minY, box.minY);
                    peakItems.top = child;
                }
                if (typeof box.maxY === 'number') {
                    maxY = Math.max(maxY, box.maxY);
                    peakItems.bottom = child;
                }
            }
        });

        if (count === 0) {
            minX = 0;
            maxX = 0;
            minY = 0;
            maxY = 0;
        }

        const groupBBox = genGroupBBox({ minX, maxX, minY, maxY });
        bboxMap.set(item.cfg.id, groupBBox);
        return groupBBox;
    }

    _calcBBox(item);
    return {
        bboxMap,
        peakItems,
    };
}

export function genGroupBBox({ minX, maxX, minY, maxY }: { minX: number; maxX: number; minY: number; maxY: number; }) {
    return {
        x: minX,
        y: minY,
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

/**
 * !!!变更prototype!!!，危险操作，谨慎
 * @param graph 
 */
export function resetProto(graph: any) {
    var group = graph.get('group');
    group.__proto__._applyChildrenMarix = function _applyChildrenMarix(totalMatrix) {
        // console.log('_applyChildrenMarix');
        this.getChildren().forEach(function eachChild(child) {
            if (!child.get('visible')) {
                return;
            }
            child.applyMatrix(totalMatrix);
        });
    }
}
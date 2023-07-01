type INode = {
    id: string;
    children?: INode[];
}
// 递归
const recursion = calcTime(function recursion(node: INode): string {
    let rsult = node.id + ';';
    return rsult + node.children?.map(recursion).join('');
})

// 递推
const iteration = calcTime(function iteration(node: INode) {
    let result = node.id + ';';
    const stack: INode[] = [...node.children || []];

    while (stack.length > 0) {
        const node = stack.shift()!;
        result += node.id + ';';
        if (node.children) {
            stack.unshift(...node.children);
        }
    }
    return result;
})

function calcTime(fn: any) {
    return (...args: any[]) => {
        const start = Date.now();
        const result = fn(...args);
        console.log(fn.name, Date.now() - start);
        return result;
    };
}


function mock(depth = 4, childCount = 10) {
    let nodeCount = 0;
    function _mock(curDepth: number, index: number, maxDepth: number) {
        const node: INode = {id: curDepth + '_' + index, children: []};
        nodeCount++;
        if (curDepth >= maxDepth) {
            return node;
        }
        for (let i = 0; i < childCount; i++) {
            node.children!.push(_mock(curDepth + 1, i, maxDepth));
        }
        return node;
    }

    const result = _mock(0, 0, depth);
    console.log('nodeCount', nodeCount)
    return result;
}

const mockData = mock(8, 4);
// console.log('mockData', mockData)
// console.log(iteration(mockData))
// console.log(recursion(mockData))
iteration(mockData)
recursion(mockData)
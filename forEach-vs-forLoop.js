var len = 20000;
var arr1 = new Array(len).fill(1);
var result = 0;
console.time('by forEach')
arr1.forEach(item => {
    result += item;
})
console.timeEnd('by forEach')


var result = 0;
console.time('by forLoop')
for (let i = 0; i < len; i++) {
    const item = arr1[i];
    result += item;
}
console.timeEnd('by forLoop')
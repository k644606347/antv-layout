class A1 {
    cfg = new Map();
    // cfg = {};
    set(name, val) {
        this.cfg[name] = val;
    }
    get(name) {
        return this.cfg[name];
    }
}

class A2 extends A1 {}
class A3 extends A2 {}
class A4 extends A3 {}
class A5 extends A4 {
    set(name, val) {
        super.set(name, val);
    }
}
class A6 extends A5 {}
class A7 extends A6 {}
class A8 extends A7 {}
class A9 extends A8 {}


function setBy(instance, name, value) {
    instance.cfg[name] =value;
}
function getBy(instance, name) {
    return instance.cfg[name];
}

var arr1 = new Array(50000).fill(new A9())
for (let i=0; i<arr1.length;i++) {
    var a5 = arr1[i];
    setBy(a5, 'prop' + i, i);
    // getBy(a5, 'prop' + i);
}
console.time('by setBy')
for (let i=0; i<arr1.length;i++) {
    var a5 = arr1[i];
    // setBy(a5, 'prop' + i, i);
    getBy(a5, 'prop' + i);
}
console.timeEnd('by setBy')

var arr1 = new Array(50000).fill(new A9())
for (let i=0; i<arr1.length;i++) {
    var a5 = arr1[i];
    a5.set('prop' + i, i);
    // getBy(a5, 'prop' + i);
}
console.time('by proto')
for (let i=0; i<arr1.length;i++) {
    var a5 = arr1[i];
    // a5.set('prop' + i, i);
    a5.get('prop' + i);
}
console.timeEnd('by proto')

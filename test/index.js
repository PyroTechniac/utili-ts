/* eslint-disable @typescript-eslint/no-var-requires, no-console */

const Utilities = require('../');
const assert = require('assert');

const tests = [];

function test(desc, fn) {
    tests.push([desc, fn]);
}

function execute() {
    Promise.all(tests.map((t, i) => {
        try {
            console.log(`Trying: ${t[0]}`);
            t[1]();
            console.log(`Completed: ${t[0]}`);
        } catch (err) {
            console.error(`Failed to: ${t[0]}\n${err.stack || err}`);
            tests.splice(i, 1);
        }
    })).then(mapped => console.log(`Completed ${tests.length} tests\nFailed ${mapped.length - tests.length} tests`));
}

test('Do basic set operations', () => {
    const list = new Utilities.List();
    list.add('a');
    assert.strictEqual(list.size, 1);
    assert.ok(list.has('a'));
    list.delete('a');
    assert.ok(!list.has('a'));
    list.clear();
    assert.strictEqual(list.size, 0);
});

test('Do basic map operations', () => {
    const coll = new Utilities.Collection();
    coll.set('a', 1);
    assert.strictEqual(coll.size, 1);
    assert.ok(coll.has('a'));
    assert.strictEqual(coll.get('a'), 1);
    coll.delete('a');
    assert.ok(!coll.has('a'));
    assert.strictEqual(coll.get('a'), undefined);
    coll.clear();
    assert.strictEqual(coll.size, 0);
});

test('Convert list to array with caching', () => {
    const list = new Utilities.List();
    list.add('a');
    list.add('b');
    list.add('c');
    const array1 = list.array();
    assert.deepStrictEqual(array1, ['a', 'b', 'c']);
    assert.ok(array1 === list.array());
    list.add('d');
    const array2 = list.array();
    assert.deepStrictEqual(array2, ['a', 'b', 'c', 'd']);
    assert.ok(array2 === list.array());
});

test('Convert collection to array with caching', () => {
    const coll = new Utilities.Collection();
    coll.set('a', 1)
        .set('b', 2)
        .set('c', 3);
    const array1 = coll.array();
    assert.deepStrictEqual(array1, [1, 2, 3]);
    assert.ok(array1 === coll.array());
    coll.set('d', 4);
    const array2 = coll.array();
    assert.deepStrictEqual(array2, [1, 2, 3, 4]);
    assert.ok(array2 === coll.array());
});

test('Get the first item of the list', () => {
    const list = new Utilities.List(['a', 'b', 'c']);
    assert.strictEqual(list.first(), 'a');
});

test('Get the first item of the collection', () => {
    const coll = new Utilities.Collection()
        .set('a', 1)
        .set('b', 2);
    assert.strictEqual(coll.first(), 1);
});

test('Get the first 3 items of the list where size equals', () => {
    const list = new Utilities.List([1, 2, 3, 4, 5]);
    assert.deepStrictEqual(list.first(3), [1, 2, 3]);
});

test('Get the first 3 items of the collection where size equals', () => {
    const coll = new Utilities.Collection();
    coll.set('a', 1);
    coll.set('b', 2);
    coll.set('c', 3);
    assert.deepStrictEqual(coll.first(3), [1, 2, 3]);
});

test('Get the first 3 items of the list where size is less', () => {
    const list = new Utilities.List();
    list.add(1);
    list.add(2);
    assert.deepStrictEqual(list.first(3), [1, 2]);
});

test('Get the first 3 items of the collection where size is less', () => {
    const coll = new Utilities.Collection()
        .set('a', 1)
        .set('b', 2);
    assert.deepStrictEqual(coll.first(3), [1, 2]);
});

test('Get the last item of a list', () => {
    const list = new Utilities.List();
    list.add(1);
    list.add(2);
    assert.deepStrictEqual(list.last(), 2);
});

test('Get the last item of a collection', () => {
    assert.deepStrictEqual(new Utilities.Collection([['a', 1], ['b', 2]]).last(), 2);
});

test('Get the last 3 items of a list', () => {
    const list = new Utilities.List();
    list.add(1);
    list.add(2);
    list.add(3);
    assert.deepStrictEqual(list.last(3), [1, 2, 3]);
});

test('Get the last 3 items of a collection', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]);
    assert.deepStrictEqual(coll.last(3), [1, 2, 3]);
});

test('Get the last 3 items of a list where size is less', () => {
    const list = new Utilities.List();
    list.add(1);
    list.add(2);
    assert.deepStrictEqual(list.last(3), [1, 2]);
});

test('Get the last 3 items of a collection where size is less', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2]
    ]);
    assert.deepStrictEqual(coll.last(3), [1, 2]);
});

test('Find an item in the list', () => {
    const list = new Utilities.List();
    list.add(1);
    list.add(2);
    assert.strictEqual(list.find(x => x === 1), 1);
    assert.strictEqual(list.find(x => x === 10), undefined);
});

test('Find an item in the collection', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2]
    ]);
    assert.strictEqual(coll.find(x => x === 1), 1);
    assert.strictEqual(coll.find(x => x === 10), undefined);
});

test('Sweep items from a list', () => {
    const list = new Utilities.List();
    list.add(1);
    list.add(2);
    list.add(3);
    const n1 = list.sweep(x => x === 2);
    assert.strictEqual(n1, 1);
    assert.deepStrictEqual(list.array(), [1, 3]);
    const n2 = list.sweep(x => x === 4);
    assert.strictEqual(n2, 0);
    assert.deepStrictEqual(list.array(), [1, 3]);
});

test('Sweep items from a collection', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]);
    const n1 = coll.sweep(x => x === 2);
    assert.strictEqual(n1, 1);
    assert.deepStrictEqual(coll.array(), [1, 3]);
    const n2 = coll.sweep(x => x === 4);
    assert.strictEqual(n2, 0);
    assert.deepStrictEqual(coll.array(), [1, 3]);
});

test('Filter items from a list', () => {
    const list = new Utilities.List();
    list.add(1)
        .add(2)
        .add(3);
    const filtered = list.filter(x => x % 2 === 1);
    assert.strictEqual(list.size, 3);
    assert.strictEqual(filtered.size, 2);
    assert.deepStrictEqual(filtered.array(), [1, 3]);
});

test('Filter items from a collection', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]);

    const filtered = coll.filter(x => x % 2 === 1);
    assert.strictEqual(coll.size, 3);
    assert.strictEqual(filtered.size, 2);
    assert.deepStrictEqual(filtered.array(), [1, 3]);
});

test('Partition a list into 2 lists', () => {
    const list = new Utilities.List();
    for (let i = 1; i < 7; i++) list.add(i);

    const [even, odd] = list.partition(x => x % 2 === 0);
    assert.deepStrictEqual(even.array(), [2, 4, 6]);
    assert.deepStrictEqual(odd.array(), [1, 3, 5]);
});

test('Partition a collection into 2 collections', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
        ['e', 5],
        ['f', 6]
    ]);
    const [even, odd] = coll.partition(x => x % 2 === 0);
    assert.deepStrictEqual(even.array(), [2, 4, 6]);
    assert.deepStrictEqual(odd.array(), [1, 3, 5]);
});

test('Map items in a list into an array', () => {
    const list = new Utilities.List([1, 2, 3]);
    const mapped = list.map(x => x + 1);
    assert.deepStrictEqual(mapped, [2, 3, 4]);
});

test('Map items in a collection into an array', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]);
    const mapped = coll.map(x => x + 1);
    assert.deepStrictEqual(mapped, [2, 3, 4]);
});

test('Map items in a list into a list', () => {
    const list = new Utilities.List();
    list.add(1)
        .add(2)
        .add(3);
    const mapped = list.mapValues(x => x + 1);
    assert.deepStrictEqual(mapped.array(), [2, 3, 4]);
});

test('Map items in a collection into a collection', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]);
    const mapped = coll.mapValues(x => x + 1);
    assert.deepStrictEqual(mapped.array(), [2, 3, 4]);
});

test('Check if some items pass a predicate (list)', () => {
    const list = new Utilities.List();
    list.add(1)
        .add(2)
        .add(3);
    assert.ok(list.some(x => x === 2));
});

test('Check if some items pass a predicate (collection)', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]);
    assert.ok(coll.some(x => x === 2));
});

test('Check if every item passes a predicate (list)', () => {
    assert.ok(!new Utilities.List([1, 2, 3]).every(x => x === 2));
});

test('Check if every item passes a predicate (collection)', () => {
    assert.ok(!new Utilities.Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]).every(x => x === 2));
});

test('Reduce list into a single value with initial value', () => {
    assert.strictEqual(new Utilities.List([1, 2, 3]).reduce((a, x) => a + x, 0), 6);
});

test('Reduce collection into a single value with initial value', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]);
    const sum = coll.reduce((a, x) => a + x, 0);
    assert.strictEqual(sum, 6);
});

test('Reduce list into a single value without initial value', () => {
    assert.strictEqual(new Utilities.List([1, 2, 3]).reduce((a, x) => a + x), 6);
});

test('Reduce collection into a single value without initial value', () => {
    const coll = new Utilities.Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]);
    assert.strictEqual(coll.reduce((a, x) => a + x), 6);
});

test('Reduce empty list without initial value', () => {
    const list = new Utilities.List();
    assert.throws(() => list.reduce((a, x) => a + x), /^TypeError: Reduce of empty list with no initial value$/);
});

test('Reduce empty collection without initial value', () => {
    const coll = new Utilities.Collection();
    assert.throws(() => coll.reduce((a, x) => a + x), /^TypeError: Reduce of empty collection with no initial value$/);
});

test('Iterate over each item (list)', () => {
    const list = new Utilities.List();
    list.add(1)
        .add(2)
        .add(3);
    const a = [];
    list.each((v1, v2) => a.push([v1, v2]));
    assert.deepStrictEqual(a, [[1, 1], [2, 2], [3, 3]]);
});

test('Iterate over each item (collection)', () => {
    const coll = new Utilities.Collection()
        .set('a', 1)
        .set('b', 2)
        .set('c', 3);
    const a = [];
    coll.each((v, k) => a.push([k, v]));
    assert.deepStrictEqual(a, [['a', 1], ['b', 2], ['c', 3]]);
});

test('Tap the list', () => {
    const list = new Utilities.List();
    list.add(1)
        .add(2)
        .add(3);
    list.tap(l => assert.ok(l === list));
});

test('Tap the collection', () => {
    const coll = new Utilities.Collection()
        .set('a', 1)
        .set('b', 2)
        .set('c', 3);
    coll.tap(c => assert.ok(c === coll));
});

test('Shallow clone the list', () => {
    const list = new Utilities.List();
    list.add(1)
        .add(2)
        .add(3);
    const clone = list.clone();
    assert.deepStrictEqual(list.array(), clone.array());
});

test('Shallow clone the collection', () => {
    const coll = new Utilities.Collection()
        .set('a', 1)
        .set('b', 2)
        .set('c', 3)
        .set('d', 4)
        .set('e', 5);
    const clone = coll.clone();
    assert.deepStrictEqual(coll.array(), clone.array());
    assert.deepStrictEqual(coll.keyArray(), clone.keyArray());
});

test('Merge multiple lists', () => {
    const list1 = new Utilities.List();
    list1.add(1);
    const list2 = new Utilities.List();
    list2.add(2);
    const list3 = new Utilities.List();
    list3.add(3);
    const merged = list1.concat(list2, list3);
    assert.deepStrictEqual(merged.array(), [1, 2, 3]);
    assert.ok(list1 !== merged);
});

test('Merge multiple collections', () => {
    const coll1 = new Utilities.Collection()
        .set('a', 1);
    const coll2 = new Utilities.Collection()
        .set('b', 2);
    const coll3 = new Utilities.Collection()
        .set('c', 3);
    const merged = coll1.concat(coll2, coll3);
    assert.deepStrictEqual(merged.array(), [1, 2, 3]);
    assert.deepStrictEqual(merged.keyArray(), ['a', 'b', 'c']);
    assert.ok(coll1 !== merged);
});

test('Check equality of two lists', () => {
    const list1 = new Utilities.List();
    list1.add(1);
    const list2 = new Utilities.List();
    list2.add(1);
    assert.ok(list1.equals(list2));
    list2.add(2);
    assert.ok(!list1.equals(list2));
    list2.clear();
    assert.ok(!list1.equals(list2));
});

test('Check equality of two collections', () => {
    const coll1 = new Utilities.Collection()
        .set('a', 1);
    const coll2 = new Utilities.Collection()
        .set('a', 1);
    assert.ok(coll1.equals(coll2));
    coll2.set('b', 2);
    assert.ok(!coll1.equals(coll2));
    coll2.clear();
    assert.ok(!coll1.equals(coll2));
});

test('Sort a list in place', () => {
    const list = new Utilities.List();
    list.add(3)
        .add(2)
        .add(1);
    assert.deepStrictEqual(list.array(), [3, 2, 1]);
    list.sort((a, b) => a - b);
    assert.deepStrictEqual(list.array(), [1, 2, 3]);
});

test('Sort a collection in place', () => {
    const coll = new Utilities.Collection([
        ['a', 3],
        ['b', 2],
        ['c', 1]
    ]);
    assert.deepStrictEqual(coll.array(), [3, 2, 1]);
    assert.deepStrictEqual(coll.keyArray(), ['a', 'b', 'c']);
    coll.sort((a, b) => a - b);
    assert.deepStrictEqual(coll.array(), [1, 2, 3]);
    assert.deepStrictEqual(coll.keyArray(), ['c', 'b', 'a']);
});

test('Random select from a list', () => {
    const list = new Utilities.List();
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

    for (let i = 0; i < chars.length; i++) list.add([chars[i], numbers[i]]);

    const random = list.random(5);
    assert.ok(random.length === 5, 'Random didn\'t return 5 elements');

    const set = new Set(random);
    assert.ok(set.size === random.length, 'Random returned the same elements X times');
});

test('Random select from a collection', () => {
    const coll = new Utilities.Collection();
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

    for (let i = 0; i < chars.length; i++) coll.set(chars[i], numbers[i]);

    const random = coll.random(5);
    assert.ok(random.length === 5, 'Random didn\'t return 5 elements');

    const set = new Set(random);
    assert.ok(set.size === random.length, 'Random returned the same elements X times');
});

test('Random thisArg tests (list)', () => {
    const list = new Utilities.List()
        .add(3)
        .add(2)
        .add(1);

    const object = {};
    const string = 'Hi';
    const boolean = false;
    const symbol = Symbol('testArg');
    const array = [1, 2, 3];

    list.add(object)
        .add(string)
        .add(boolean)
        .add(symbol)
        .add(array);

    list.some(function thisArgTest1(value) {
        assert.deepStrictEqual(this.valueOf(), 1, 'thisArg is not the number');
        assert.ok(this instanceof Number, 'thisArg is not a Number class');
        return value === this;
    }, 1);

    list.some(function thisArgTest2(value) {
        assert.deepStrictEqual(this, object, 'thisArg is not the object');
        assert.ok(this.constructor === Object, 'thisArg is not an Object class');
        return value === this;
    }, object);

    list.some(function thisArgTest3(value) {
        assert.deepStrictEqual(this.valueOf(), string, 'thisArg is not the string');
        assert.ok(this instanceof String, 'thisArg is not a String class');
        return value === this;
    }, string);

    list.some(function thisArgTest4(value) {
        assert.deepStrictEqual(this.valueOf(), boolean, 'thisArg is not the boolean');
        assert.ok(this instanceof Boolean, 'thisArg is not a Boolean class');
        return value === this;
    }, boolean);

    list.some(function thisArgTest5(value) {
        assert.deepStrictEqual(this.valueOf(), symbol, 'thisArg is not the symbol');
        assert.ok(this instanceof Symbol, 'thisArg is not a Symbol class');
        return value === this;
    }, symbol);

    list.some(function thisArgTest6(value) {
        assert.deepStrictEqual(this, array, 'thisArg has different elements than the array');
        assert.ok(Array.isArray(this), 'thisArg is not an Array class');
        return value === this;
    }, array);
});

test('Random thisArg tests (collection)', () => {
    const coll = new Utilities.Collection();
    coll.set('a', 3);
    coll.set('b', 2);
    coll.set('c', 1);

    const object = {};
    const string = 'Hi';
    const boolean = false;
    const symbol = Symbol('testArg');
    const array = [1, 2, 3];

    coll.set('d', object);
    coll.set('e', string);
    coll.set('f', boolean);
    coll.set('g', symbol);
    coll.set('h', array);

    coll.some(function thisArgTest1(value) {
        assert.deepStrictEqual(this.valueOf(), 1, 'thisArg is not the number');
        assert.ok(this instanceof Number, 'thisArg is not a Number class');
        return value === this;
    }, 1);

    coll.some(function thisArgTest2(value) {
        assert.deepStrictEqual(this, object, 'thisArg is not the object');
        assert.ok(this.constructor === Object, 'thisArg is not an Object class');
        return value === this;
    }, object);

    coll.some(function thisArgTest3(value) {
        assert.deepStrictEqual(this.valueOf(), string, 'thisArg is not the string');
        assert.ok(this instanceof String, 'thisArg is not a String class');
        return value === this;
    }, string);

    coll.some(function thisArgTest4(value) {
        assert.deepStrictEqual(this.valueOf(), boolean, 'thisArg is not the boolean');
        assert.ok(this instanceof Boolean, 'thisArg is not a Boolean class');
        return value === this;
    }, boolean);

    coll.some(function thisArgTest5(value) {
        assert.deepStrictEqual(this.valueOf(), symbol, 'thisArg is not the symbol');
        assert.ok(this instanceof Symbol, 'thisArg is not a Symbol class');
        return value === this;
    }, symbol);

    coll.some(function thisArgTest6(value) {
        assert.deepStrictEqual(this, array, 'thisArg has different elements than array');
        assert.ok(Array.isArray(this), 'thisArg is not an Array class');
        return value === this;
    }, array);
});

execute();
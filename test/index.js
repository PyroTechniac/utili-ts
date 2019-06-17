/* eslint-disable @typescript-eslint/no-var-requires */

const test = require('tape');
const Util = require('../');

test('Do basic map operations', t => {
    t.plan(6);
    const coll = new Util.Collection();
    coll.set('a', 1);
    t.equal(coll.size, 1);
    t.ok(coll.has('a'));
    t.equal(coll.get('a'), 1);
    coll.delete('a');
    t.notOk(coll.has('a'));
    t.equal(coll.get('a'), undefined);
    coll.clear();
    t.equal(coll.size, 0);
});

test('Do basic set operations', t => {
    t.plan(4);
    const list = new Util.List();
    list.add(1);
    t.equal(list.size, 1);
    t.ok(list.has(1));
    list.delete(1);
    t.notOk(list.has(1));
    t.equal(list.size, 0);
});

test('Convert collection to array with caching', t => {
    t.plan(8);
    const coll = new Util.Collection();
    coll.set('a', 1);
    coll.set('b', 2);
    coll.set('c', 3);
    const array1 = coll.array();
    const keyArray1 = coll.keyArray();
    t.deepEqual(array1, [1, 2, 3]);
    t.deepEqual(keyArray1, ['a', 'b', 'c']);
    t.ok(array1 === coll.array());
    t.ok(keyArray1 === coll.keyArray());
    coll.set('d', 4);
    const array2 = coll.array();
    const keyArray2 = coll.keyArray();
    t.deepEqual(array2, [1, 2, 3, 4]);
    t.deepEqual(keyArray2, ['a', 'b', 'c', 'd']);
    t.ok(array2 === coll.array());
    t.ok(keyArray2 === coll.keyArray());
});

test('Convert list to array with caching', t => {
    t.plan(4);
    const list = new Util.List([1, 2, 3]);
    const array1 = list.array();
    t.deepEqual(array1, [1, 2, 3]);
    t.ok(array1 === list.array());
    list.add(4);
    const array2 = list.array();
    t.deepEqual(array2, [1, 2, 3, 4]);
    t.ok(array2 === list.array());
});

test('Get the first item of the collection', t => {
    t.plan(1);
    const coll = new Util.Collection();
    coll.set('a', 1);
    coll.set('b', 2);
    t.equal(coll.first(), 1);
});

test('Get the first item fo the list', t => {
    t.plan(1);
    const list = new Util.List([1, 2, 3, 4, 5]);
    t.equal(list.first(), 1);
});

test('Get the first 3 items of the collection', t => {
    t.plan(1);
    const coll = new Util.Collection();
    coll.set('a', 1);
    coll.set('b', 2);
    coll.set('c', 3);
    t.deepEqual(coll.first(3), [1, 2, 3]);
});

test('Get the first 3 items of the list', t => {
    t.plan(1);
    const list = new Util.List([1, 2, 3]);
    t.deepEqual(list.first(3), [1, 2, 3]);
});

test('Get the first 3 items of the collection where size is less', t => {
    t.plan(1);
    const coll = new Util.Collection()
        .set('a', 1)
        .set('b', 2);
    t.deepEqual(coll.last(3), [1, 2]);
});

test('Get the last item of the collection', t => {
    t.plan(1);
    const coll = new Util.Collection([
        ['a', 1],
        ['b', 2]
    ]);
    t.deepEqual(coll.last(), 2);
});
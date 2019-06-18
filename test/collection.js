/* eslint-disable @typescript-eslint/no-var-requires */

const test = require('tape');
const { Collection } = require('../dist');

test('Do basic map operations', t => {
    t.plan(6);
    const coll = new Collection();
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

test('Convert collection to array with caching', t => {
    t.plan(8);
    const coll = new Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]);
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

test('Get the first item of the collection', t => {
    t.plan(2);
    const coll = new Collection();
    coll.set('a', 1)
        .set('b', 2);
    t.equal(coll.first(), 1);
    t.equal(coll.firstKey(), 'a');
});

test('Get the first 3 items of the collection where size equals', t => {
    t.plan(2);
    const coll = new Collection([
        ['a', 1],
        ['b', 2],
        ['c', 3]
    ]);
    t.deepEqual(coll.first(3), [1, 2, 3]);
    t.deepEqual(coll.firstKey(3), ['a', 'b', 'c']);
});

test('Get the first 3 items of the collection where size is less', t => {
    t.plan(2);
    const coll = new Collection([
        ['a', 1],
        ['b', 2]
    ]);

    t.deepEqual(coll.first(3), [1, 2]);
    t.deepEqual(coll.firstKey(3), ['a', 'b']);
});

test('Get the last item of the collection', t => {
    t.plan(2);
    const coll = new Collection([
        ['a', 1],
        ['b', 2]
    ]);
    t.equal(coll.last(), 2);
    t.equal(coll.lastKey(), 'b');
});
import { throws } from 'assert';

/**
 * Per notes in the LICENSE file, this project contains code from Amish Shah's Discord.js
 * library. The code is from the Collections object, in the collection's repository found at https://github.com/discordjs/collection.
 * 
 * All code below is sourced from Collections.
 * https://github.com/discordjs/collection
 */

class Collection<K, V> extends Map<K, V> {
    private _array!: V[] | null;

    private _keyArray!: K[] | null;

    public static readonly default: typeof Collection = Collection;

    public constructor(entries?: readonly (readonly [K, V])[] | null) {
        super(entries);

        Object.defineProperty(this, '_array', { value: null, writable: true, configurable: true });

        Object.defineProperty(this, '_keyArray', { value: null, writable: true, configurable: true });
    }

    public set(key: K, value: V): this {
        this._array = null;
        this._keyArray = null;
        return super.set(key, value);
    }

    public delete(key: K): boolean {
        this._array = null;
        this._keyArray = null;
        return super.delete(key);
    }

    public array(): V[] {
        if (!this._array || this._array.length !== this.size) this._array = [...this.values()];
        return this._array;
    }

    public keyArray(): K[] {
        if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = [...this.keys()];
        return this._keyArray;
    }

    public first(): V | undefined;

    public first(amount: number): V[];

    public first(amount?: number): V | V[] | undefined {
        if (typeof amount === 'undefined') return this.values().next().value;
        if (amount < 0) return this.last(amount * -1);
        amount = Math.min(this.size, amount);
        const iter = this.values();
        return Array.from({ length: amount }, (): V => iter.next().value);
    }

    public firstKey(): K | undefined;

    public firstKey(amount: number): K[];

    public firstKey(amount?: number): K | K[] | undefined {
        if (typeof amount === 'undefined') return this.keys().next().value;
        if (amount < 0) return this.lastKey(amount * -1);
        amount = Math.min(this.size, amount);
        const iter = this.keys();
        return Array.from({ length: amount }, (): K => iter.next().value);
    }

    public last(): V | undefined;

    public last(amount: number): V[];

    public last(amount?: number): V | V[] | undefined {
        const arr = this.array();
        if (typeof amount === 'undefined') return arr[arr.length - 1];
        if (amount < 0) return this.first(amount * -1);
        if (!amount) return [];
        return arr.slice(-amount);
    }

    public lastKey(): K | undefined;

    public lastKey(amount: number): K[];

    public lastKey(amount?: number): K | K[] | undefined {
        const arr = this.keyArray();
        if (typeof amount === 'undefined') return arr[arr.length - 1];
        if (amount < 0) return this.firstKey(amount * -1);
        if (!amount) return [];
        return arr.slice(-amount);
    }

    public random(): V;

    public random(amount: number): V[];

    public random(amount?: number): V | V[] {
        let arr = this.array();
        if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
        arr =arr.slice();
        return Array.from({ length: amount }, (): V => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }

    public randomKey(): K;

    public randomKey(amount: number): K[];

    public randomKey(amount?: number): K | K[] {
        let arr = this.keyArray();
        if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
        if (arr.length === 0 || !amount) return [];
        const rand: K[] = Array.from({ length: amount });
        arr = arr.slice();
        for (let i = 0; i < amount; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
        return rand;
    }

    public find(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): V | undefined {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this)) return val;
        }
        return undefined;
    }

    public findKey(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): K | undefined {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this)) return key;
        }
        return undefined;
    }

    public sweep(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): number {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        const previousSize =this.size;
        for (const [key, val] of this) {
            if (fn(val, key, this)) this.delete(key);
        }
        return previousSize - this.size;
    }

    public filter(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): Collection<K, V> {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        // @ts-ignore
        const results: Collection<K, V> = new this.constructor[Symbol.species]();
        for (const [key, val] of this) {
            if (fn(val, key, this)) results.set(key, val);
        }
        return results;
    }

    public partition(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): [Collection<K, V>, Collection<K, V>] {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        // @ts-ignore
        const results: [Collection<K, V>, Collection<K, V>] = [new this.constructor[Symbol.species](), new this.constructor[Symbol.species]()];
        for (const [key, val] of this) {
            if (fn(val, key, this)) results[0].set(key, val);
            else results[1].set(key, val);
        }
        return results;
    }

    public map<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: any): T[] {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        const iter = this.entries();
        return Array.from({ length: this.size }, (): T => {
            const [key, value] = iter.next().value;
            return fn(value, key, this);
        });
    }

    public mapValues<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: any): Collection<K, T> {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        // @ts-ignore
        const coll: Collection<K, T> = new this.constructor[Symbol.species]();
        for (const [key, val] of this) coll.set(key, fn(val, key, this));
        return coll;
    }

    public some(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): boolean {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        for (const [key, val] of this) if (fn(val, key, this)) return true;
        return false;
    }

    public every(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): boolean {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        for (const [key, val] of this) if (!fn(val, key, this)) return false;
        return true;
    }

    public reduce<T>(fn: (accumulator: any, value: V, key: K, collection: this) => T, initialValue?: T): T {
        let accumulator!: T;

        if (typeof initialValue !== 'undefined') {
            accumulator = initialValue;
            for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
            return accumulator;
        }
        let first = true;
        for (const [key, val] of this) {
            if (first) {
                accumulator = val as unknown as T;
                first = false;
                continue;
            }
            accumulator = fn(accumulator, val, key, this);
        }

        // No items iterated.
        if (first) {
            throw new TypeError('Reduce of empty collection with no initial value');
        }

        return accumulator;
    }
    
    public each(fn: (value: V, key: K, collection: Map<K, V>) => any, thisArg?: any): this {
        this.forEach(fn, thisArg);
        return this;
    }

    public tap(fn: (collection: this) => any, thisArg?: any): this {
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
        fn(this);
        return this;
    }

    public clone(): Collection<K, V> {
        // @ts-ignore
        return new this.constructor[Symbol.species](this);
    }

    public concat(...collections: Collection<K, V>[]): Collection<K, V> {
        const newColl = this.clone();
        for (const coll of collections) {
            for (const [key, val] of coll) newColl.set(key, val);
        }
        return newColl;
    }

    public equals(collection: Collection<K, V>): boolean {
        if (!collection) return false;
        if (this === collection) return true;
        if (this.size !== collection.size) return false;
        for (const [key, value] of this) {
            if (!collection.has(key) || value !== collection.get(key)) {
                return false;
            }
        }
        return true;
    }

    public sort(compareFunction: (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number = (x, y): number => Number(x > y) || Number(x === y) - 1): this {
        const entries = [...this.entries()];
        entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]));
        this.clear();
        for (const [k, v] of entries) {
            this.set(k, v);
        }
        return this;
    }
}

export = Collection as typeof Collection & {
    default: typeof Collection;
}
import { randomInitialValue, tupleHashCode } from "./hash.ts";

export class HashMap<K extends readonly unknown[], V> {
  #initialHash: number;
  #map: Map<number, [K, V][]>;
  #size: number;

  constructor() {
    this.#initialHash = randomInitialValue();
    this.#map = new Map();
    this.#size = 0;
  }

  get size(): number {
    return this.#size;
  }

  has(key: K): boolean {
    const keyHash = tupleHashCode(key, this.#initialHash);
    const values = this.#map.get(keyHash);
    if (!values) {
      return false;
    }
    for (const [storedKey] of values) {
      if (equalTuple(storedKey, key)) {
        return true;
      }
    }
    return false;
  }

  get(key: K): V | undefined {
    const keyHash = tupleHashCode(key, this.#initialHash);
    const values = this.#map.get(keyHash);
    if (!values) {
      return undefined;
    }
    for (const [storedKey, value] of values) {
      if (equalTuple(storedKey, key)) {
        return value;
      }
    }
    return undefined;
  }

  set(key: K, value: V): this {
    const keyHash = tupleHashCode(key, this.#initialHash);
    const values = this.#map.get(keyHash);
    if (!values) {
      this.#map.set(keyHash, [[key, value]]);
      this.#size++;
    } else {
      for (const entry of values) {
        if (equalTuple(entry[0], key)) {
          entry[1] = value;
          return this;
        }
      }
      values.push([key, value]);
      this.#size++;
    }
    return this;
  }

  delete(key: K): boolean {
    const keyHash = tupleHashCode(key, this.#initialHash);
    const values = this.#map.get(keyHash);
    if (!values) {
      return false;
    }
    for (let i = 0; i < values.length; i++) {
      if (equalTuple(values[i]![0], key)) {
        swapRemove(values, i);
        this.#size--;
        return true;
      }
    }
    return false;
  }

  clear(): void {
    this.#map.clear();
    this.#size = 0;
  }

  forEach(callbackfn: (value: V, key: K, map: HashMap<K, V>) => void, thisArg?: any): void {
    for (const values of this.#map.values()) {
      for (const [key, value] of values) {
        callbackfn.call(thisArg, value, key, this);
      }
    }
  }

  *[Symbol.iterator](): IterableIterator<[K, V]> {
    for (const values of this.#map.values()) {
      for (const [key, value] of values) {
        yield [key, value];
      }
    }
  }

  *entries(): IterableIterator<[K, V]> {
    for (const values of this.#map.values()) {
      for (const [key, value] of values) {
        yield [key, value];
      }
    }
  }

  *keys(): IterableIterator<K> {
    for (const values of this.#map.values()) {
      for (const [key] of values) {
        yield key;
      }
    }
  }

  *values(): IterableIterator<V> {
    for (const values of this.#map.values()) {
      for (const [, value] of values) {
        yield value;
      }
    }
  }
}

function equalTuple(a: readonly unknown[], b: readonly unknown[]): boolean {
  return a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
}

function swapRemove<T>(a: T[], index: number): void {
  const lastIndex = a.length - 1;
  if (index === lastIndex) {
    a.pop();
  } else {
    a[index] = a[lastIndex]!;
    a.pop();
  }
}

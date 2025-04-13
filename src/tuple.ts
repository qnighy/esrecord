import { Interner } from "./interner.ts";
import { isObject, isPrimitiveTuple, primitiveTuples, type AnyESTuple, type ESTuple } from "./primitives.ts";

const tupleInterner = new Interner<readonly unknown[], AnyESTuple>();
/**
 * Represents the tuple object's [[TupleData]] internal slot.
 */
const tupleDataRef = new WeakMap<object, AnyESTuple>();

/**
 * The type of the {@link Tuple} constructor.
 */
export interface TupleConstructor {
  /**
   * Creates a new primitive Tuple value from the given items.
   *
   * @param items the list of items to create the Tuple from.
   */
  <A extends any[]>(...items: A): ESTuple<A>;

  /**
   * Creates a new primitive Tuple value from the given array or iterable.
   */
  from<A extends any[]>(items: A): ESTuple<A>;

  /**
   * Creates a new primitive Tuple value from the given array or iterable.
   */
  from<T>(items: Iterable<T> | ArrayLike<T>): ESTuple<T[]>;

  /**
   * Creates a new primitive Tuple value from the given array or iterable.
   */
  from<T, U>(items: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): ESTuple<U[]>;

  /**
   * Creates a new primitive Tuple value from the given items.
   *
   * @param items the list of items to create the Tuple from.
   */
  of<A extends any[]>(...items: A): ESTuple<A>;

  prototype: Tuple<any>;
}

/**
 * The type of the {@link Tuple} instance,
 * as analogous to {@link Array} and {@link ReadonlyArray}.
 */
export interface Tuple<T> {
  at(index: number): T | undefined;
  valueOf(): ESTuple<T[]>;
  [Symbol.toStringTag]: "Tuple";
  slice(start?: number, end?: number): ESTuple<T[]>;
  concat(...args: ConcatArray<T>[]): ESTuple<T[]>;
  concat(...args: (T | ConcatArray<T>)[]): ESTuple<T[]>;
  includes(searchElement: T, fromIndex?: number): boolean;
  indexOf(searchElement: T, fromIndex?: number): number;
  join(separator?: string): string;
  lastIndexOf(searchElement: T, fromIndex?: number): number;
  entries(): ArrayIterator<[number, T]>;
  every<S extends T>(callbackfn: (value: T, index: number, tuple: ESTuple<T[]>) => value is S, thisArg?: any): this is Tuple<S>;
  every(callbackfn: (value: T, index: number, tuple: ESTuple<T[]>) => unknown, thisArg?: any): boolean;
  filter<S extends T>(callbackfn: (value: T, index: number, tuple: ESTuple<T[]>) => value is S, thisArg?: any): ESTuple<S[]>;
  filter(callbackfn: (value: T, index: number, tuple: ESTuple<T[]>) => unknown, thisArg?: any): ESTuple<T[]>;
  find<S extends T>(predicate: (value: T, index: number, tuple: ESTuple<T[]>) => value is S, thisArg?: any): S | undefined;
  find(predicate: (value: T, index: number, tuple: ESTuple<T[]>) => unknown, thisArg?: any): T | undefined;
  findIndex(predicate: (value: T, index: number, tuple: ESTuple<T[]>) => unknown, thisArg?: any): number;
  findLast<S extends T>(predicate: (value: T, index: number, tuple: ESTuple<T[]>) => value is S, thisArg?: any): S | undefined;
  findLast(predicate: (value: T, index: number, tuple: ESTuple<T[]>) => unknown, thisArg?: any): T | undefined;
  findLastIndex(predicate: (value: T, index: number, tuple: ESTuple<T[]>) => unknown, thisArg?: any): number;
  flat<A, D extends number = 1>(this: A, depth?: D): ESTuple<FlatArray<A, D>[]>;
  flatMap<U, This = undefined>(mapperFunction: (this: This, value: T, index: number, tuple: ESTuple<T[]>) => U | ESTuple<U[]>, thisArg?: This): ESTuple<U[]>;
  forEach(callbackfn: (value: T, index: number, tuple: ESTuple<T[]>) => void, thisArg?: any): void;
  keys(): ArrayIterator<number>;
  map<U>(callbackfn: (value: T, index: number, tuple: ESTuple<T[]>) => U, thisArg?: any): U[];
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, tuple: ESTuple<T[]>) => T): T;
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, tuple: ESTuple<T[]>) => T, initialValue: T): T;
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, tuple: ESTuple<T[]>) => U, initialValue: U): U;
  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, tuple: ESTuple<T[]>) => T): T;
  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, tuple: ESTuple<T[]>) => T, initialValue: T): T;
  reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, tuple: ESTuple<T[]>) => U, initialValue: U): U;
  some(callbackfn: (value: T, index: number, tuple: ESTuple<T[]>) => unknown, thisArg?: any): boolean;
  toLocaleString(): string;
  toString(): string;
  values(): ArrayIterator<T>;
  [Symbol.iterator](): ArrayIterator<T>;
  toReversed(): ESTuple<T[]>;
  toSorted(comparefn?: (a: T, b: T) => number): ESTuple<T[]>;
  toSpliced(start: number, deleteCount: number, ...items: T[]): ESTuple<T[]>;
  toSpliced(start: number, deleteCount?: number): ESTuple<T[]>;
  with(index: number, value: T): ESTuple<T[]>;
}

export const Tuple: TupleConstructor = function Tuple<A extends any[]>(...items: A): ESTuple<A> {
  if (new.target != null) {
    throw new TypeError("Tuple is not a constructor");
  }
  for (const item of items) {
    if (isObject(item)) {
      throw new TypeError("Tuple cannot contain object values");
    }
  }
  return tupleInterner.intern(items, () => createPrimitiveTuple(items)) as ESTuple<A>;
} as TupleConstructor;

const tuplePrototype: Tuple<any> = Object.create(null) as Tuple<any>;

const tupleStaticMethods = {
  from(items: ArrayLike<unknown> | Iterable<unknown>, mapfn: ((v: unknown, k: number) => unknown) | undefined = undefined, thisArg: any = undefined): ESTuple<unknown[]> {
    const arr = Array.from(items, mapfn!, thisArg);
    return Tuple(...arr);
  },

  of(...items: unknown[]): ESTuple<unknown[]> {
    return Tuple(...items);
  },
};

Object.defineProperty(Tuple, "name", {
  value: "Tuple",
  writable: false,
  enumerable: false,
  configurable: true,
});
Object.defineProperty(Tuple, "from", {
  value: tupleStaticMethods.from,
  writable: true,
  enumerable: false,
  configurable: true,
});
Object.defineProperty(Tuple, "of", {
  value: tupleStaticMethods.of,
  writable: true,
  enumerable: false,
  configurable: true,
});
Object.defineProperty(Tuple, "prototype", {
  value: tuplePrototype,
  writable: false,
  enumerable: false,
  configurable: false,
});

function createPrimitiveTuple(items: readonly unknown[]): AnyESTuple {
  const tup = createMinArray(items);
  Object.freeze(tup);
  primitiveTuples.add(tup as readonly unknown[] as AnyESTuple);
  return tup as readonly unknown[] as AnyESTuple;
}

/**
 * Convert a Tuple primitive to a Tuple object.
 */
export function TupleToObject<A extends any[]>(tuple: ESTuple<A>): Readonly<A> {
  const obj = createMinArray(tuple);
  tupleDataRef.set(obj, tuple);
  Object.freeze(obj);
  return obj as readonly unknown[] as Readonly<A>;
}

function thisTupleValue(value: unknown): AnyESTuple {
  if (isPrimitiveTuple(value)) {
    return value;
  }
  const prim = getTuplePrimitive(value);
  if (prim != null) {
    return prim;
  }
  throw new TypeError("Not a Tuple value nor a Tuple object");
}

/**
 * Like Array.from, but initializes an Array-like ordinary object.
 */
function createMinArray(items: readonly unknown[]): unknown[] {
  const arr: unknown[] = Object.create(tuplePrototype);
  for (let i = 0; i < items.length; i++) {
    arr[i] = items[i];
  }
  arr.length = items.length;
  Object.defineProperty(arr, "length", {
    enumerable: false,
  });
  return arr;
}

/**
 * Checks if the given object is a Tuple wrapper object,
 * and if so, returns the Tuple primitive it wraps.
 */
export function getTuplePrimitive(maybeTuple: unknown): AnyESTuple | undefined {
  return tupleDataRef.get(maybeTuple as object);
}

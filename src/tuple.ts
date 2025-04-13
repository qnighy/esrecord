import type { AnyESTuple } from "./types.ts";
import { Interner } from "./interner.ts";
import { isObject, primitiveTuples } from "./primitives.ts";

const tupleInterner = new Interner<readonly unknown[], readonly unknown[]>();
/**
 * Represents the tuple object's [[TupleData]] internal slot.
 */
const tupleDataRef = new WeakMap<readonly unknown[], readonly unknown[]>();

export function Tuple(...items: readonly unknown[]): readonly unknown[] {
  if (new.target != null) {
    throw new TypeError("Tuple is not a constructor");
  }
  for (const item of items) {
    if (isObject(item)) {
      throw new TypeError("Tuple cannot contain object values");
    }
  }
  return tupleInterner.intern(items, () => createPrimitiveTuple(items));
}

const tuplePrototype = Object.create(null);
Object.defineProperty(Tuple, "prototype", {
  value: tuplePrototype,
  writable: false,
  enumerable: false,
  configurable: false,
});

function createPrimitiveTuple(items: readonly unknown[]): readonly unknown[] {
  const tup = createMinArray(items);
  Object.freeze(tup);
  primitiveTuples.add(tup as readonly unknown[] as AnyESTuple);
  return tup;
}

/**
 * Convert a Tuple primitive to a Tuple object.
 */
export function TupleToObject(tuple: readonly unknown[]): readonly unknown[] {
  const obj = createMinArray(tuple);
  tupleDataRef.set(obj, tuple);
  Object.freeze(obj);
  return obj;
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
export function getTuplePrimitive(maybeTuple: unknown): readonly unknown[] | undefined {
  return tupleDataRef.get(maybeTuple as readonly unknown[]);
}

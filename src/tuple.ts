import { Interner } from "./interner.ts";
import { isObject, primitiveTuples, type AnyESTuple, type ESTuple } from "./primitives.ts";

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

const tuplePrototype = Object.create(null);
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

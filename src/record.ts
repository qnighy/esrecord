import { Interner } from "./interner.ts";
import { isObject, primitiveRecords, type AnyESRecord, type ESRecord } from "./primitives.ts";

const recordInterner = new Interner<readonly unknown[], AnyESRecord>();
/**
 * Represents the record object's [[RecordData]] internal slot.
 */
const recordDataRef = new WeakMap<object, AnyESRecord>();

/**
 * The type of the {@link Record} constructor.
 */
export interface RecordConstructor {
  /**
   * Creates a new primitive Record value from the given object.
   *
   * @param arg the object providing the key-value pairs for the Record.
   */
  <T>(arg: T): ESRecord<T>;

  /**
   * Creates a new primitive Record value from the given key-value pairs.
   * @param entries the key-value pairs to create the Record from.
   */
  fromEntries<K extends string, V>(entries: Iterable<readonly [K, V]>): ESRecord<{ [k in K]?: V; }>;

  /**
   * Checks if the given object is a Record wrapper object.
   * @param obj the object to test against.
   */
  [Symbol.hasInstance](obj: unknown): boolean;

  prototype: null;
}

export const Record: RecordConstructor = function Record<T>(arg: T): ESRecord<T> {
  if (new.target != null) {
    throw new TypeError("Record is not a constructor");
  }
  const obj = ToObject(arg);
  const entries = recordSourceEntries(obj);
  entries.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  const key = entries.flatMap(([key, value]) => [key, value]);
  return recordInterner.intern(key, () => createPrimitiveRecord(entries)) as ESRecord<T>;
} as RecordConstructor;

const recordMethods = {
  fromEntries<K extends string, V>(entries: Iterable<readonly [K, V]>): ESRecord<{ [k in K]?: V; }> {
    const obj = Object.fromEntries(entries);
    return Record(obj) as ESRecord<{ [k in K]?: V; }>;
  },

  [Symbol.hasInstance](obj: unknown): boolean {
    return typeof obj === "object" && obj != null && Boolean(getRecordPrimitive(obj));
  },
};

Object.defineProperty(Record, "name", {
  value: "Record",
  writable: false,
  enumerable: false,
  configurable: true,
});
Object.defineProperty(Record, "fromEntries", {
  value: recordMethods.fromEntries,
  writable: true,
  enumerable: false,
  configurable: true,
});
Object.defineProperty(Record, Symbol.hasInstance, {
  value: recordMethods[Symbol.hasInstance],
  writable: false,
  enumerable: false,
  configurable: true,
});
Object.defineProperty(Record, "prototype", {
  value: null,
  writable: false,
  enumerable: false,
  configurable: false,
});

function createPrimitiveRecord(entries: [string, unknown][]): AnyESRecord {
  const rec: Record<string, unknown> = Object.create(null);
  for (const [key, value] of entries) {
    // It needs not be Object.defineProperty because the object
    // in question has no prototype.
    rec[key] = value;
  }
  Object.freeze(rec);
  primitiveRecords.add(rec as AnyESRecord);
  return rec as AnyESRecord;
}

/**
 * Convert a Record primitive to a Record object.
 */
export function RecordToObject<T>(record: ESRecord<T>): T {
  const obj = { ...record };
  recordDataRef.set(obj, record);
  Object.freeze(obj);
  return obj;
}

/**
 * Checks if the given object is a Record object,
 * and if so, returns the Record primitive it wraps.
 */
export function getRecordPrimitive(maybeRecord: unknown): AnyESRecord | undefined {
  return recordDataRef.get(maybeRecord as object);
}

function ToObject<T>(arg: T): T & object {
  if (arg == null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  return Object(arg);
}

/**
 * Similar to {@link Object.entries}, but bails early when
 *
 * - it encounters an owned enumerable Symbol property
 * - or it encounters an object-valued property
 */
function recordSourceEntries(obj: object): [string, unknown][] {
  const ownPropertyKeys = Reflect.ownKeys(obj);
  const entries: [string, unknown][] = [];
  for (const key of ownPropertyKeys) {
    const desc = Reflect.getOwnPropertyDescriptor(obj, key);
    if (desc == null || !desc.enumerable) {
      continue;
    }
    if (typeof key === "symbol") {
      throw new TypeError("Record cannot contain Symbol properties");
    }
    const value = Reflect.get(obj, key, obj);
    if (isObject(value)) {
      throw new TypeError("Record cannot contain object values");
    }
    entries.push([key, value]);
  }
  return entries;
}

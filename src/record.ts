import { Interner } from "./interner.ts";
import { isObject, primitiveRecords } from "./primitives.ts";

const recordInterner = new Interner<readonly unknown[], Record<string, unknown>>();
/**
 * Represents the record object's [[RecordData]] internal slot.
 */
const recordDataRef = new WeakMap<Record<string, unknown>, Record<string, unknown>>();

export function Record(arg: Record<string, unknown>): Record<string, unknown> {
  if (new.target != null) {
    throw new TypeError("Record is not a constructor");
  }
  const obj = ToObject(arg);
  const entries = recordSourceEntries(obj);
  entries.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  const key = entries.flatMap(([key, value]) => [key, value]);
  return recordInterner.intern(key, () => createPrimitiveRecord(entries));
}

Record.prototype = null;

function createPrimitiveRecord(entries: [string, unknown][]): Record<string, unknown> {
  const rec: Record<string, unknown> = Object.create(null);
  for (const [key, value] of entries) {
    // It needs not be Object.defineProperty because the object
    // in question has no prototype.
    rec[key] = value;
  }
  Object.freeze(rec);
  primitiveRecords.add(rec);
  return rec;
}

/**
 * Convert a Record primitive to a Record object.
 */
export function RecordToObject(record: Record<string, unknown>): Record<string, unknown> {
  const obj = { ...record };
  recordDataRef.set(obj, record);
  Object.freeze(obj);
  return obj;
}

/**
 * Checks if the given object is a Record object,
 * and if so, returns the Record primitive it wraps.
 */
export function getRecordPrimitive(maybeRecord: unknown): Record<string, unknown> | undefined {
  return recordDataRef.get(maybeRecord as Record<string, unknown>);
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

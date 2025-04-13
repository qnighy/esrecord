import type { AnyESRecord, AnyESTuple } from "./types.ts";

export const primitiveRecords: WeakSet<AnyESRecord> = new WeakSet();
export const primitiveTuples: WeakSet<AnyESTuple> = new WeakSet();

export function isObjectOriginal(value: unknown): value is object {
  return (typeof value === "object" || typeof value === "function") && value !== null;
}

export function isObject(value: unknown): value is object {
  return isObjectOriginal(value) && !isPrimitiveRecord(value) && !isPrimitiveTuple(value);
}

export function isPrimitiveRecord(value: unknown): value is AnyESRecord {
  return primitiveRecords.has(value as AnyESRecord);
}

export function isPrimitiveTuple(value: unknown): value is AnyESTuple {
  return primitiveTuples.has(value as AnyESTuple);
}

import type { Tuple } from "./tuple.ts";

/**
 * A dummy value to use as a brand for the {@link ESRecord} type.
 */
export declare const esRecordBrand: unique symbol;

/**
 * A replacement type for the future primitive Record type,
 * which will presumably be written as `#{ key: value }`.
 */
export type ESRecord<T> = Readonly<T> & { [esRecordBrand]: "ESRecord" };
export type AnyESRecord = ESRecord<Record<string, unknown>>;

/**
 * A dummy value to use as a brand for the {@link ESTuple} type.
 */
export declare const esTupleBrand: unique symbol;

/**
 * A replacement type for the future primitive Tuple type,
 * which will presumably be written as `#[value, value]`.
 */
export type ESTuple<A extends any[]> = Readonly<A> & { [esTupleBrand]: "ESTuple" } & Tuple<A[number]>;
export type AnyESTuple = ESTuple<unknown[]>;


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

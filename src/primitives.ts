import type { Tuple } from "./tuple.ts";

/**
 * A dummy class to use as a brand for the {@link ESRecord} type.
 */
export declare class ESRecordBrand {
  #isRecord: unknown;
}

/**
 * A replacement type for the future primitive Record type,
 * which will presumably be written as `#{ key: value }`.
 */
export type ESRecord<T> = Readonly<T> & ESRecordBrand;
export type AnyESRecord = ESRecord<Record<string, unknown>>;

/**
 * A dummy class to use as a brand for the {@link ESTuple} type.
 */
export declare class ESTupleBrand {
  #isTuple: unknown;
}

/**
 * A replacement type for the future primitive Tuple type,
 * which will presumably be written as `#[value, value]`.
 */
export type ESTuple<A extends any[]> = Readonly<A> & ESTupleBrand & Tuple<A[number]>;
export type AnyESTuple = ESTuple<unknown[]>;

/**
 * A dummy class to create a user-defined internal slot
 * via private identifiers.
 */
class ESRecordStorage extends (function (x: object) { return x; } as Function as {
  new (x: object): object;
}) {
  /**
   * Equivalent to the [[RecordData]] internal slot.
   * If missing, the object represents a primitive Record.
   */
  #primitiveRecordRef: object | undefined;

  static allocate(obj: object, primitiveRecordRef: object | undefined): void {
    new ESRecordStorage(obj);
    (obj as ESRecordStorage).#primitiveRecordRef = primitiveRecordRef;
  }

  /**
   * Checks if the object represents a primitive Record.
   */
  static isPrimitiveRecord(value: unknown): value is AnyESRecord {
    return #primitiveRecordRef in (value as any) && (value as ESRecordStorage).#primitiveRecordRef == null;
  }

  /**
   * Checks if the object represents a Record wrapper object.
   */
  static isRecordWrapper(value: unknown): boolean {
    return #primitiveRecordRef in (value as any) && (value as ESRecordStorage).#primitiveRecordRef != null;
  }
}

export const primitiveTuples: WeakSet<AnyESTuple> = new WeakSet();

export function isObjectOriginal(value: unknown): value is object {
  return (typeof value === "object" || typeof value === "function") && value !== null;
}

export function isObject(value: unknown): value is object {
  return isObjectOriginal(value) && !isPrimitiveRecord(value) && !isPrimitiveTuple(value);
}

export function allocateRecord(obj: object, primitiveRecordRef: object | undefined): void {
  ESRecordStorage.allocate(obj, primitiveRecordRef);
}

export function isPrimitiveRecord(value: unknown): value is AnyESRecord {
  return ESRecordStorage.isPrimitiveRecord(value);
}

export function isRecordWrapper(value: unknown): boolean {
  return ESRecordStorage.isRecordWrapper(value);
}

export function isPrimitiveTuple(value: unknown): value is AnyESTuple {
  return primitiveTuples.has(value as AnyESTuple);
}

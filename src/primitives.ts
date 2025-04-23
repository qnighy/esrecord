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

export function isObjectOriginal(value: unknown): value is object {
  return (typeof value === "object" || typeof value === "function") && value !== null;
}

export function isObject(value: unknown): value is object {
  return isObjectOriginal(value) && !isPrimitiveRecord(value) && !isPrimitiveTuple(value);
}

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

export function allocateRecord(obj: object, primitiveRecordRef: object | undefined): void {
  ESRecordStorage.allocate(obj, primitiveRecordRef);
}

export function isPrimitiveRecord(value: unknown): value is AnyESRecord {
  return ESRecordStorage.isPrimitiveRecord(value);
}

export function isRecordWrapper(value: unknown): boolean {
  return ESRecordStorage.isRecordWrapper(value);
}

/**
 * A dummy class to create a user-defined internal slot
 * via private identifiers.
 */
class ESTupleStorage extends (function (x: object) { return x; } as Function as {
  new (x: object): object;
}) {
  /**
   * Equivalent to the [[TupleData]] internal slot.
   * If missing, the object represents a primitive Tuple.
   */
  #primitiveTupleRef: object | undefined;

  static allocate(obj: object, primitiveTupleRef: object | undefined): void {
    new ESTupleStorage(obj);
    (obj as ESTupleStorage).#primitiveTupleRef = primitiveTupleRef;
  }

  /**
   * Checks if the object represents a primitive Tuple.
   */
  static isPrimitiveTuple(value: unknown): value is AnyESTuple {
    return #primitiveTupleRef in (value as any) && (value as ESTupleStorage).#primitiveTupleRef == null;
  }

  /**
   * Checks if the object represents a Tuple wrapper object.
   */
  static isTupleWrapper(value: unknown): boolean {
    return #primitiveTupleRef in (value as any) && (value as ESTupleStorage).#primitiveTupleRef != null;
  }

  static extractPrimitiveTuple(value: unknown): AnyESTuple {
    if (#primitiveTupleRef in (value as any)) {
      const tuple = (value as ESTupleStorage).#primitiveTupleRef;
      return (tuple ?? value) as AnyESTuple;
    }
    throw new TypeError("Not a Tuple value nor a Tuple object");
  }
}

export function allocateTuple(obj: object, primitiveTupleRef: object | undefined): void {
  ESTupleStorage.allocate(obj, primitiveTupleRef);
}

export function isPrimitiveTuple(value: unknown): value is AnyESTuple {
  return ESTupleStorage.isPrimitiveTuple(value);
}

export function isTupleWrapper(value: unknown): boolean {
  return ESTupleStorage.isTupleWrapper(value);
}

export function extractPrimitiveTuple(value: unknown): AnyESTuple {
  return ESTupleStorage.extractPrimitiveTuple(value);
}

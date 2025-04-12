export const primitiveRecords: WeakSet<object> = new WeakSet();
export const primitiveTuples: WeakSet<object> = new WeakSet();

export function isObjectOriginal(value: unknown): value is object {
  return (typeof value === "object" || typeof value === "function") && value !== null;
}

export function isObject(value: unknown): value is object {
  return isObjectOriginal(value) && !isPrimitiveRecord(value) && !isPrimitiveTuple(value);
}

export function isPrimitiveRecord(value: unknown): boolean {
  return primitiveRecords.has(value as object);
}

export function isPrimitiveTuple(value: unknown): boolean {
  return primitiveTuples.has(value as object);
}

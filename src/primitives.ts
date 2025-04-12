export const primitiveRecords: WeakSet<object> = new WeakSet();

export function isObjectOriginal(value: unknown): value is object {
  return (typeof value === "object" || typeof value === "function") && value !== null;
}

export function isObject(value: unknown): value is object {
  return isObjectOriginal(value) && !primitiveRecords.has(value);
}

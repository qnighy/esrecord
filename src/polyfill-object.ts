import { isPrimitiveRecord, isPrimitiveTuple } from "./primitives.ts";
import { RecordToObject } from "./record.ts";
import { TupleToObject } from "./tuple.ts";

/**
 * Wrapper for Object(val).
 */
export function ObjectCall(val: unknown): object {
  if (typeof val === "object" && val != null) {
    if (isPrimitiveRecord(val)) {
      return RecordToObject(val as Record<string, unknown>);
    } else if (isPrimitiveTuple(val)) {
      return TupleToObject(val as readonly unknown[]);
    }
  }
  return Object(val);
}

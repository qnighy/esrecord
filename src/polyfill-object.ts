import { isPrimitiveRecord } from "./primitives.ts";
import { RecordToObject } from "./record.ts";

/**
 * Wrapper for Object(val).
 */
export function ObjectCall(val: unknown): object {
  if (typeof val === "object" && val != null) {
    if (isPrimitiveRecord(val)) {
      return RecordToObject(val as Record<string, unknown>);
    }
  }
  return Object(val);
}

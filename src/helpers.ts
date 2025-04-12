import { isPrimitiveRecord } from "./primitives.ts";

/**
 * Replacement for the typeof operator.
 */
export function typeof_(value: unknown): string {
  const origTypeof = typeof value;
  if (origTypeof === "object" && value != null) {
    if (isPrimitiveRecord(value)) {
      return "record";
    }
  }
  return origTypeof;
}

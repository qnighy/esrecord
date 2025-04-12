import { describe, expect, it  } from "vitest";
import { Tuple } from "./tuple.ts";
import { ObjectCall } from "./polyfill-object.ts";

describe("Tuple", () => {
  it("returns the same value for the equivalent input", () => {
    const tup1 = Tuple(1, 2);
    const tup2 = Tuple(1, 2);
    expect(tup1).toBe(tup2);
  });

  it("returns different values for different inputs", () => {
    const tup1 = Tuple(1, 2);
    const tup2 = Tuple(2, 3);
    expect(tup1).not.toBe(tup2);
  });

  it("returns the object with the same sequence of elements", () => {
    const tup = Tuple(1, 2);
    expect(Array.from(ObjectCall(tup) as any)).toEqual([1, 2]);
  });
});

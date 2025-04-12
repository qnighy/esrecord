import { describe, expect, it } from "vitest";
import { Interner } from "./interner.ts";

describe("Interner", () => {
  it("creates a new value for a new key", () => {
    const interner = new Interner();
    const value = interner.intern([1, 2, 3], () => ({ name: "value1" }));
    expect(value).toEqual({ name: "value1" });
  });

  it("creates different values for different keys", () => {
    const interner = new Interner();
    const value1 = interner.intern([1, 2, 3], () => ({ name: "value1" }));
    const value2 = interner.intern([4, 5, 6], () => ({ name: "value2" }));
    expect(value1).toEqual({ name: "value1" });
    expect(value2).toEqual({ name: "value2" });
  });

  it("returns the same value for the same key", () => {
    const interner = new Interner();
    const value1 = interner.intern([1, 2, 3], () => ({ name: "value1" }));
    const value2 = interner.intern([1, 2, 3], () => ({ name: "value2" }));
    expect(value1).toBe(value2);
    expect(value1).toEqual({ name: "value1" });
  });
});

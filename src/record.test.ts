import { describe, expect, it  } from "vitest";
import { Record } from "./record.ts";
import { ObjectCall } from "./polyfill-object.ts";

describe("Record", () => {
  it("returns the same value for the equivalent input", () => {
    const rec1 = Record({ a: 1, b: 2 });
    const rec2 = Record({ a: 1, b: 2 });
    expect(rec1).toBe(rec2);
  });

  it("returns the same value for the inputs with different property order", () => {
    const rec1 = Record({ a: 1, b: 2 });
    const rec2 = Record({ b: 2, a: 1 });
    expect(rec1).toBe(rec2);
  });

  it("returns the object with the same set of properties", () => {
    const rec = Record({ a: 1, b: 2 });
    expect(ObjectCall(rec)).toEqual({
      a: 1,
      b: 2,
    });
  });

  it("sorts the properties by their names", () => {
    const rec = Record({
      a2: 1,
      b1: 2,
      "": 3,
      a1: 4,
      b2: 5,
    });
    expect(Object.keys(ObjectCall(rec))).toEqual([
      "",
      "a1",
      "a2",
      "b1",
      "b2",
    ]);
  });

  it("sorts the Unicode-named properties by their names", () => {
    const rec = Record({
      "🍻": 1,
      가: 2,
      "\uF901": 3,
      "🍺": 4,
      각: 5,
      "\uF900": 6,
    });
    expect(Object.keys(ObjectCall(rec))).toEqual([
      "가",
      "각",
      "🍺",
      "🍻",
      "\uF900",
      "\uF901",
    ]);
  });
});

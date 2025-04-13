import { describe, expect, it  } from "vitest";
import { Record } from "./record.ts";
import { ObjectCall } from "./polyfill-object.ts";
import { Tuple } from "./tuple.ts";

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

  it("ignores non-owned properties", () => {
    const prototype = { b: 2 };
    const obj = Object.assign(Object.create(prototype), { a: 1 });
    // obj has a non-owned property "b"
    expect(obj.b).toBe(2);

    const rec = Record(obj);
    expect(Object.keys(ObjectCall(rec))).toEqual(["a"]);
  });

  it("ignores non-enumerable properties", () => {
    // ["a"] has a non-enumerable property "length"
    expect(Object.getOwnPropertyDescriptor(["a"], "length")).toEqual({
      value: 1,
      writable: true,
      enumerable: false,
      configurable: false,
    });

    const rec = Record(["a"]);
    expect(Object.keys(ObjectCall(rec))).toEqual(["0"]);
  });

  it("throws TypeError for Symbol property keys", () => {
    expect(() => Record({ [Symbol("key")]: 1 })).toThrow(TypeError);
  });

  it("throws TypeError for property values that are objects", () => {
    expect(() => Record({ a: {} })).toThrow(TypeError);
  });

  it("allow property values that are existing primitives", () => {
    expect(() => Record({
      undefined: undefined,
      null: null,
      boolean: false,
      number: 1,
      bigint: 1n,
      string: "foo",
      symbol: Symbol("foo"),
    })).not.toThrow();
  });

  it("allow property values that are Record or Tuples", () => {
    expect(() => Record({
      record: Record({ a: 1 }),
      tuple: Tuple(1, 2),
    })).not.toThrow();
  });
});

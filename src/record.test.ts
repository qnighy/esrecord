import { describe, expect, it  } from "vitest";
import { Record } from "./record.ts";
import { ObjectCall } from "./polyfill-object.ts";
import { Tuple } from "./tuple.ts";

describe("Record", () => {
  it("throws TypeError when called as a constructor", () => {
    expect(() => new (Record as any)({})).toThrow(TypeError);
  });

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

  it("allows property values that are existing primitives", () => {
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

  it("allows property values that are Record or Tuples", () => {
    expect(() => Record({
      record: Record({ a: 1 }),
      tuple: Tuple(1, 2),
    })).not.toThrow();
  });
});

describe("Record.name", () => {
  it("is 'Record'", () => {
    expect(Record.name).toBe("Record");
  });
  it("is a non-writable, non-enumerable, and configurable property", () => {
    expect(Object.getOwnPropertyDescriptor(Record, "name")).toEqual({
      value: Record.name,
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });
});

describe("Record.fromEntries", () => {
  it("is a writable, non-enumerable, and configurable property", () => {
    expect(Object.getOwnPropertyDescriptor(Record, "fromEntries")).toEqual({
      value: Record.fromEntries,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  });

  it("generates a Record from an array of entries", () => {
    const rec1 = Record.fromEntries([
      ["a", 1],
      ["b", 2],
    ]);
    const rec2 = Record({ a: 1, b: 2 });
    expect(rec1).toBe(rec2);
  });

  it("throws TypeError for undefined", () => {
    expect(() => Record.fromEntries(undefined as any)).toThrow(TypeError);
  });

  it("throws TypeError for null", () => {
    expect(() => Record.fromEntries(null as any)).toThrow(TypeError);
  });

  it("throws TypeError for non-iterable entries", () => {
    expect(() => Record.fromEntries({} as any)).toThrow(TypeError);
  });

  it("generates a Record from an iterable of entries", () => {
    const entries = (function* (): Generator<[string, number]> {
      yield ["a", 1];
      yield ["b", 2];
    })();
    const rec1 = Record.fromEntries(entries);
    const rec2 = Record({ a: 1, b: 2 });
    expect(rec1).toBe(rec2);
  });
});

describe("Record[Symbol.hasInstance]", () => {
  it("is a non-writable, non-enumerable, and configurable property", () => {
    expect(Object.getOwnPropertyDescriptor(Record, Symbol.hasInstance)).toEqual({
      value: Record[Symbol.hasInstance],
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });

  it("returns true for Record wrappers", () => {
    const obj = ObjectCall(Record({}));
    expect(obj).toBeInstanceOf(Record);
  });

  it("returns false for non-Record instances", () => {
    expect({}).not.toBeInstanceOf(Record);
  });

  it("returns false for Record primitives", () => {
    const rec = Record({ a: 1, b: 2 });
    expect(rec).not.toBeInstanceOf(Record);
  });
});

describe("Record.prototype", () => {
  it("is null", () => {
    expect(Record.prototype).toBe(null);
  });
  it("is a non-writable, non-enumerable, and configurable property", () => {
    expect(Object.getOwnPropertyDescriptor(Record, "prototype")).toEqual({
      value: Record.prototype,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  });
});

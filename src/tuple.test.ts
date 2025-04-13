import { describe, expect, it  } from "vitest";
import { Tuple } from "./tuple.ts";
import { ObjectCall } from "./polyfill-object.ts";
import { Record } from "./record.ts";

describe("Tuple", () => {
  it("throws TypeError when called as a constructor", () => {
    expect(() => new (Tuple as any)()).toThrow(TypeError);
  });

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

  it("throws TypeError for items that are objects", () => {
    expect(() => Tuple({})).toThrow(TypeError);
  });

  it("allows items that are existing primitives", () => {
    expect(() => Tuple(
      undefined,
      null,
      false,
      1,
      1n,
      "foo",
      Symbol("foo"),
    )).not.toThrow();
  });

  it("allows items that are Record or Tuples", () => {
    expect(() => Tuple(
      Record({ a: 1 }),
      Tuple(1, 2),
    )).not.toThrow();
  });
});

describe("Tuple.name", () => {
  it("is 'Tuple'", () => {
    expect(Tuple.name).toBe("Tuple");
  });
  it("is a non-writable, non-enumerable, and configurable property", () => {
    expect(Object.getOwnPropertyDescriptor(Tuple, "name")).toEqual({
      value: Tuple.name,
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });
});

describe("Tuple.from", () => {
  it("is a writable, non-enumerable, and configurable property", () => {
    expect(Object.getOwnPropertyDescriptor(Tuple, "from")).toEqual({
      value: Tuple.from,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  });

  it("cannot be called as a constructor", () => {
    expect(() => new (Tuple.from as any)()).toThrow(TypeError);
  });

  it("generates a Tuple from an array", () => {
    const tup1 = Tuple.from([1, 2]);
    const tup2 = Tuple(1, 2);
    expect(tup1).toBe(tup2);
  });

  it("generates a Tuple from an iterable", () => {
    const tup1 = Tuple.from(new Set([1, 2]));
    const tup2 = Tuple(1, 2);
    expect(tup1).toBe(tup2);
  });

  it("generates a Tuple from an Array-like object", () => {
    const tup1 = Tuple.from({ length: 2, 0: 1, 1: 2 });
    const tup2 = Tuple(1, 2);
    expect(tup1).toBe(tup2);
  });
});

describe("Tuple.of", () => {
  it("is a writable, non-enumerable, and configurable property", () => {
    expect(Object.getOwnPropertyDescriptor(Tuple, "of")).toEqual({
      value: Tuple.of,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  });

  it("cannot be called as a constructor", () => {
    expect(() => new (Tuple.of as any)()).toThrow(TypeError);
  });

  it("generates a Tuple from the arguments", () => {
    const tup1 = Tuple.of(1, 2);
    const tup2 = Tuple(1, 2);
    expect(tup1).toBe(tup2);
  });
});

describe("Tuple.prototype", () => {
  it("is not writable, not enumerable, and not configurable", () => {
    expect(Object.getOwnPropertyDescriptor(Tuple, "prototype")).toEqual({
      value: Tuple.prototype,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  });
});

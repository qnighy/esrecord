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

describe("Tuple.prototype.constructor", () => {
  it("is Tuple", () => {
    expect(Tuple.prototype.constructor).toBe(Tuple);
  });

  it("is writable, non-enumerable, and configurable", () => {
    expect(Object.getOwnPropertyDescriptor(Tuple.prototype, "constructor")).toEqual({
      value: Tuple.prototype.constructor,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  });
});

describe("Tuple.prototype[Symbol.toStringTag]", () => {
  it("is 'Tuple'", () => {
    expect(Tuple.prototype[Symbol.toStringTag]).toBe("Tuple");
  });

  it("is non-writable, non-enumerable, and configurable", () => {
    expect(Object.getOwnPropertyDescriptor(Tuple.prototype, Symbol.toStringTag)).toEqual({
      value: Tuple.prototype[Symbol.toStringTag],
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });
});

describe("Tuple.prototype.at", () => {
  it("is a writable, non-enumerable, and configurable property", () => {
    expect(Object.getOwnPropertyDescriptor(Tuple.prototype, "at")).toEqual({
      value: Tuple.prototype.at,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  });

  it("returns the element at the specified index", () => {
    const tup = Tuple(1, 2);
    expect(tup.at(0)).toBe(1);
    expect(tup.at(1)).toBe(2);
  });

  it("returns the element at the specified negative index", () => {
    const tup = Tuple(1, 2);
    expect(tup.at(-1)).toBe(2);
    expect(tup.at(-2)).toBe(1);
  });

  it("returns undefined for out-of-bounds indices", () => {
    const tup = Tuple(1, 2);
    expect(tup.at(-3)).toBe(undefined);
    expect(tup.at(3)).toBe(undefined);
  });
});

describe("Tuple.prototype.valueOf", () => {
  it("is a writable, non-enumerable, and configurable property", () => {
    expect(Object.getOwnPropertyDescriptor(Tuple.prototype, "valueOf")).toEqual({
      value: Tuple.prototype.valueOf,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  });

  it("returns the tuple itself", () => {
    const tup = Tuple(1, 2);
    expect(tup.valueOf()).toBe(tup);
  });

  it("returns the tuple primitive when called with a wrapper object", () => {
    const tup = Tuple(1, 2);
    const wrapper = ObjectCall(tup);
    expect(wrapper.valueOf()).toBe(tup);
  });

  it("throws TypeError for non-Tuple values", () => {
    const obj = [1, 2, 3];
    expect(() => Tuple.prototype.valueOf.call(obj)).toThrow(TypeError);
  });
});

describe("Tuple.prototype.find", () => {
  it("returns the first element that satisfies the predicate", () => {
    const tup = Tuple("a", "b", "c", "d");
    const result = tup.find((s) => /[bd]/.test(s));
    expect(result).toBe("b");
  });
});

describe("Tuple.prototype.findIndex", () => {
  it("returns the index of the first element that satisfies the predicate", () => {
    const tup = Tuple("a", "b", "c", "d");
    const result = tup.findIndex((s) => /[bd]/.test(s));
    expect(result).toBe(1);
  });
});

describe("Tuple.prototype.findLast", () => {
  it("returns the last element that satisfies the predicate", () => {
    const tup = Tuple("a", "b", "c", "d");
    const result = tup.findLast((s) => /[bd]/.test(s));
    expect(result).toBe("d");
  });
});

describe("Tuple.prototype.findLastIndex", () => {
  it("returns the index of the last element that satisfies the predicate", () => {
    const tup = Tuple("a", "b", "c", "d");
    const result = tup.findLastIndex((s) => /[bd]/.test(s));
    expect(result).toBe(3);
  });
});

import { describe, expect, it  } from "vitest";
import { typeof_ } from "./helpers.ts";
import { Record } from "./record.ts";
import { ObjectCall } from "./polyfill-object.ts";
import { Tuple } from "./tuple.ts";

describe("typeof_", () => {
  it("returns 'undefined' for undefined", () => {
    expect(typeof_(undefined)).toBe("undefined");
  });

  it("returns 'object' for null", () => {
    expect(typeof_(null)).toBe("object");
  });

  it("returns 'object' for an object", () => {
    expect(typeof_({})).toBe("object");
  });

  it("returns 'record' for a Record primitive", () => {
    expect(typeof_(Record({ foo: 42 }))).toBe("record");
  });

  it("returns 'object' for a Record object", () => {
    expect(typeof_(ObjectCall(Record({ foo: 42 })))).toBe("object");
  });

  it("returns 'tuple' for a Tuple primitive", () => {
    expect(typeof_(Tuple(1, 2, 3))).toBe("tuple");
  });

  it("returns 'object' for a Tuple object", () => {
    expect(typeof_(ObjectCall(Tuple(1, 2, 3)))).toBe("object");
  });
});

import { describe, expect, it  } from "vitest";
import { typeof_ } from "./helpers.ts";
import { Record } from "./record.ts";
import { ObjectCall } from "./polyfill-object.ts";

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
});

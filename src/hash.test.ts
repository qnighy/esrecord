import { describe, expect, it } from "vitest";
import { primitiveHashCode, tupleHashCode } from "./hash.ts";

const initialHash = 0xDEADBEEF;
describe("primitiveHashCode", () => {
  it("computes hash code for undefined", () => {
    expect(primitiveHashCode(undefined, initialHash)).toBe(2038665386);
  });
  it("computes hash code for null", () => {
    expect(primitiveHashCode(null, initialHash)).toBe(2021887767);
  });
  it("computes hash code for false", () => {
    expect(primitiveHashCode(false, initialHash)).toBe(2005110148);
  });
  it("computes hash code for true", () => {
    expect(primitiveHashCode(true, initialHash)).toBe(1988332529);
  });
  it("computes hash code for number 0", () => {
    expect(primitiveHashCode(0, initialHash)).toBe(1971554910);
  });
  it("computes hash code for number 1", () => {
    expect(primitiveHashCode(1, initialHash)).toBe(890263038);
  });
  it("computes hash code for number 2", () => {
    expect(primitiveHashCode(2, initialHash)).toBe(873485419);
  });
  it("computes hash code for number -1", () => {
    expect(primitiveHashCode(-1, initialHash)).toBe(-923818276);
  });
  it("computes hash code for number -0", () => {
    expect(primitiveHashCode(-0, initialHash)).toBe(-304929288);
  });
  it("computes hash code for number 0.5", () => {
    expect(primitiveHashCode(0.5, initialHash)).toBe(-1686952456);
  });
  it("computes hash code for number NaN", () => {
    expect(primitiveHashCode(NaN, initialHash)).toBe(1745561080);
  });
  it("computes hash code for bigint 0", () => {
    expect(primitiveHashCode(0n, initialHash)).toBe(2062641023);
  });
  it("computes hash code for bigint 1", () => {
    expect(primitiveHashCode(1n, initialHash)).toBe(2045863404);
  });
  it("computes hash code for string \"\"", () => {
    expect(primitiveHashCode("", initialHash)).toBe(-989271575);
  });
  it("computes hash code for string \"a\"", () => {
    expect(primitiveHashCode("a", initialHash)).toBe(-989790589);
  });
  it("computes hash code for well-known Symbol (arbitrary number)", () => {
    const hash1 = primitiveHashCode(Symbol.iterator, initialHash);
    const hash2 = primitiveHashCode(Symbol.iterator, initialHash);
    expect(hash1).toBe(hash2);
    expect(hash1).toBeTypeOf("number");
  });
  it("computes hash code for globally registered Symbol (arbitrary number)", () => {
    const sym = Symbol.for("test");
    const hash1 = primitiveHashCode(sym, initialHash);
    const hash2 = primitiveHashCode(sym, initialHash);
    expect(hash1).toBe(hash2);
    expect(hash1).toBeTypeOf("number");
  });
  it("computs hash code for locally registered Symbol (arbitrary number)", () => {
    const sym = Symbol("test");
    const hash1 = primitiveHashCode(sym, initialHash);
    const hash2 = primitiveHashCode(sym, initialHash);
    expect(hash1).toBe(hash2);
    expect(hash1).toBeTypeOf("number");
  });
  it("computes hash code for object (arbitrary number)", () => {
    const obj = { a: 1, b: 2 };
    const hash1 = primitiveHashCode(obj, initialHash);
    const hash2 = primitiveHashCode(obj, initialHash);
    expect(hash1).toBe(hash2);
    expect(hash1).toBeTypeOf("number");
  });
});

import { expect, test } from "vitest";
import { square } from "./square.ts";

test("square", () => {
  expect(square(2)).toBe(4);
});

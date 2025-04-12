import { describe, expect, it } from "vitest";
import { HashMap } from "./hash-map.ts";

describe("HashMap", () => {
  describe("has", () => {
    it("returns true for existing keys", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      expect(map.has([123, 456])).toBe(true);
    });
    
    it("returns false for non-existing keys", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      expect(map.has([789, 101])).toBe(false);
    });
  });

  describe("get", () => {
    it("returns the value for existing keys", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      expect(map.get([123, 456])).toBe("value1");
    });
    
    it("returns undefined for non-existing keys", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      expect(map.get([789, 101])).toBeUndefined();
    });
  });

  describe("set", () => {
    it("sets a value for a new key", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      expect(map.get([123, 456])).toBe("value1");
    });

    it("updates the value for an existing key", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      map.set([123, 456], "value2");
      expect(map.get([123, 456])).toBe("value2");
    });

    it("does not affect other keys when updating", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      map.set([789, 101], "value2");
      map.set([123, 456], "value3");
      expect(map.get([789, 101])).toBe("value2");
      expect(map.get([123, 456])).toBe("value3");
    });

    it("increments size when adding a new key", () => {
      const map = new HashMap();
      expect(map.size).toBe(0);
      map.set([123, 456], "value1");
      expect(map.size).toBe(1);
      map.set([789, 101], "value2");
      expect(map.size).toBe(2);
    });

    it("does not increment size when updating an existing key", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      expect(map.size).toBe(1);
      map.set([123, 456], "value2");
      expect(map.size).toBe(1);
    });

    it("returns the map instance", () => {
      const map = new HashMap();
      const result = map.set([123, 456], "value1");
      expect(result).toBe(map);
    });
  });

  describe("delete", () => {
    it("deletes an existing key", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      expect(map.delete([123, 456])).toBe(true);
      expect(map.get([123, 456])).toBeUndefined();
    });

    it("returns false for non-existing keys", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      expect(map.delete([789, 101])).toBe(false);
    });

    it("decreases size when deleting a key", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      expect(map.size).toBe(1);
      map.delete([123, 456]);
      expect(map.size).toBe(0);
    });
  });

  describe("clear", () => {
    it("clears all keys and values", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      map.set([789, 101], "value2");
      expect(map.size).toBe(2);
      map.clear();
      expect(map.size).toBe(0);
      expect(map.get([123, 456])).toBeUndefined();
      expect(map.get([789, 101])).toBeUndefined();
    });

    it("returns undefined", () => {
      const map = new HashMap();
      map.set([123, 456], "value1");
      expect(map.clear()).toBeUndefined();
    });
  });
});

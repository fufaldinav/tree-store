import { describe, expect, it } from "@jest/globals";
import { TreeStore } from "./index";

describe("TreeStore", () => {
  const ts = new TreeStore([
    { id: 1, parent: "root" },
    { id: 2, parent: 1, type: "test" },
    { id: 3, parent: 1, type: "test" },
    { id: 4, parent: 2, type: "test" },
    { id: 5, parent: 2, type: "test" },
    { id: 6, parent: 2, type: "test" },
    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
  ]);

  describe("getAll", () => {
    it("returns the correct items", () => {
      expect(ts.getAll()).toEqual([
        { id: 1, parent: "root" },
        { id: 2, parent: 1, type: "test" },
        { id: 3, parent: 1, type: "test" },
        { id: 4, parent: 2, type: "test" },
        { id: 5, parent: 2, type: "test" },
        { id: 6, parent: 2, type: "test" },
        { id: 7, parent: 4, type: null },
        { id: 8, parent: 4, type: null },
      ]);
    });
  });

  describe("getItem", () => {
    it("throws an error when id is not of the correct type", () => {
      expect(() => ts.getItem({} as never)).toThrowError();
    });

    it("returns the correct item", () => {
      expect(ts.getItem(7)).toEqual({ id: 7, parent: 4, type: null });
    });

    it("returns null when the item is not found", () => {
      expect(ts.getItem(10)).toBeNull();
    });
  });

  describe("getChildren", () => {
    it("throws an error when id is not of the correct type", () => {
      expect(() => ts.getChildren({} as never)).toThrowError();
    });

    it("returns an empty array when the item is not found", () => {
      expect(ts.getChildren(10)).toEqual([]);
    });

    it("returns an empty array when the item has no children", () => {
      expect(ts.getChildren(5)).toEqual([]);
    });

    it("returns the correct children", () => {
      expect(ts.getChildren(4)).toEqual([
        { id: 7, parent: 4, type: null },
        { id: 8, parent: 4, type: null },
      ]);
      expect(ts.getChildren(2)).toEqual([
        { id: 4, parent: 2, type: "test" },
        { id: 5, parent: 2, type: "test" },
        { id: 6, parent: 2, type: "test" },
      ]);
    });
  });

  describe("getAllChildren", () => {
    it("throws an error when id is not of the correct type", () => {
      expect(() => ts.getAllChildren({} as never)).toThrowError();
    });

    it("returns an empty array when the item is not found", () => {
      expect(ts.getAllChildren(10)).toEqual([]);
    });

    it("returns an empty array when the item has no children", () => {
      expect(ts.getAllChildren(5)).toEqual([]);
    });

    it("returns the correct children", () => {
      expect(ts.getAllChildren(2)).toEqual([
        { id: 4, parent: 2, type: "test" },
        { id: 5, parent: 2, type: "test" },
        { id: 6, parent: 2, type: "test" },
        { id: 7, parent: 4, type: null },
        { id: 8, parent: 4, type: null },
      ]);
    });
  });

  describe("getAllParents", () => {
    it("throws an error when id is not of the correct type", () => {
      expect(() => ts.getAllParents({} as never)).toThrowError();
    });

    it("returns an empty array when the item is not found", () => {
      expect(ts.getAllParents(10)).toEqual([]);
    });

    it("stops at the root item", () => {
      expect(ts.getAllParents(1)).toEqual([]);
    });

    it("returns the correct parents", () => {
      expect(ts.getAllParents(7)).toEqual([
        { id: 4, parent: 2, type: "test" },
        { id: 2, parent: 1, type: "test" },
        { id: 1, parent: "root" },
      ]);
    });
  });
});

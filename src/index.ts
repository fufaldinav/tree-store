import { MESSAGES, ROOT_ID } from "./constants";
import type {
  MappedItemRelations,
  MappedItemStorage,
  TreeItem,
  TreeStoreInterface,
  TreeStoreOptions,
} from "./types";
import sourceItems from "./source-items.json";

export class TreeStore implements TreeStoreInterface {
  private ignoreDuplicates: boolean;
  private ignoreRoot: boolean;
  private ignoreIdType: boolean;
  private sourceItems: TreeItem[];
  private mappedItems: MappedItemStorage = new Map();
  private mappedItemRelations: MappedItemRelations = new Map();

  private checkDuplicates() {
    if (this.sourceItems.length === this.mappedItems.size) {
      return;
    }

    if (this.ignoreDuplicates) {
      console.warn(MESSAGES.DUPLICATES_FOUND);
    } else {
      throw new Error(MESSAGES.DUPLICATES_FOUND);
    }
  }

  private checkRoot() {
    if (!this.mappedItems.has(ROOT_ID)) {
      return;
    }

    if (this.ignoreRoot) {
      console.warn(MESSAGES.ROOT_ITEM_FOUND);
    } else {
      throw new Error(MESSAGES.ROOT_ITEM_FOUND);
    }
  }

  private checkIdType(id: TreeItem["id"]) {
    if (this.ignoreIdType) {
      return;
    }

    if (typeof id !== "number" && typeof id !== "string") {
      throw new Error(
        `${MESSAGES.ID_TYPE_INVALID}. Found ${typeof id} instead.`,
      );
    }
  }

  private getParentId(item: TreeItem): TreeItem["parent"] {
    return item.parent ?? ROOT_ID;
  }

  private createOrUpdateRelation(item: TreeItem) {
    const parentId = this.getParentId(item);
    if (!this.mappedItemRelations.has(parentId)) {
      this.mappedItemRelations.set(parentId, [item]);
    } else {
      this.mappedItemRelations.get(parentId)?.push(item);
    }
  }

  private mapSourceItems() {
    this.sourceItems.forEach((item) => {
      const id = item.id;
      this.checkIdType(id);

      const parentId = item.parent;
      if (parentId !== undefined) this.checkIdType(parentId);

      this.mappedItems.set(id, item);
      this.createOrUpdateRelation(item);
    });
  }

  // private getItemsById(...ids: TreeItem["id"][]): TreeItem[] {
  //   const items: TreeItem[] = [];
  //   for (const id of ids) {
  //     const item = this.mappedItems.get(id);
  //     if (!item) continue;
  //     items.push(item);
  //   }
  //   return items;
  // }

  constructor(items: TreeItem[], options: TreeStoreOptions = {}) {
    this.sourceItems = items;

    const {
      ignoreDuplicates = false,
      ignoreRoot = false,
      ignoreIdType = false,
    } = options;

    this.ignoreDuplicates = ignoreDuplicates;
    this.ignoreRoot = ignoreRoot;
    this.ignoreIdType = ignoreIdType;

    this.mapSourceItems();

    this.checkDuplicates();
    this.checkRoot();
  }

  getAll() {
    return this.sourceItems;
  }

  getItem(id: TreeItem["id"]) {
    this.checkIdType(id);
    return this.mappedItems.get(id) ?? null;
  }

  getChildren(id: TreeItem["id"]) {
    this.checkIdType(id);
    return this.mappedItemRelations.get(id) ?? [];
  }

  getAllChildren(id: TreeItem["id"]) {
    this.checkIdType(id);
    const allChildren = this.getChildren(id);
    if (allChildren.length === 0) return allChildren;

    allChildren.forEach(({ id }) => {
      allChildren.push(...this.getAllChildren(id));
    });

    return allChildren;
  }

  getAllParents(id: TreeItem["id"]) {
    const parents: TreeItem[] = [];

    const child = this.getItem(id);
    if (!child) return parents;

    let parentId = this.getParentId(child);

    while (parentId !== ROOT_ID) {
      const currentParent = this.getItem(parentId);
      if (!currentParent) break;
      parents.push(currentParent);
      parentId = this.getParentId(currentParent);
    }

    return parents;
  }
}

const ts = new TreeStore(sourceItems);
console.log(ts.getAll(), "\n");
console.log(ts.getItem(7), "\n");
console.log(ts.getChildren(4), "\n");
console.log(ts.getChildren(5), "\n");
console.log(ts.getChildren(2), "\n");
console.log(ts.getAllChildren(2), "\n");
console.log(ts.getAllParents(7), "\n");

import { MESSAGES, ROOT_ID } from "./constants";
import {
  MappedItemStorage,
  TreeItem,
  TreeStoreInterface,
  TreeStoreOptions,
} from "./types";

export class TreeStore implements TreeStoreInterface {
  private ignoreDuplicates: boolean;
  private ignoreRoot: boolean;
  private ignoreIdType: boolean;
  private sourceItems: TreeItem[];
  private mappedItems: MappedItemStorage;

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

  private mapItems(items: TreeItem[]) {
    const mappedItems: MappedItemStorage = new Map();
    items.forEach(({ id, ...data }) => {
      this.checkIdType(id);
      mappedItems.set(id, data);
    });
    return mappedItems;
  }

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

    this.mappedItems = this.mapItems(items);

    this.checkDuplicates();
    this.checkRoot();
  }

  getAll: () => [];
  getItem: (id: TreeItem["id"]) => null;
  getChildren: (id: TreeItem["id"]) => [];
  getAllChildren: (id: TreeItem["id"]) => [];
  getAllParents: (id: TreeItem["id"]) => [];
}

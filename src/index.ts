const ROOT_ID = "root";
const MESSAGES = {
  ROOT_ITEM_FOUND: "Root item found in items",
  DUPLICATES_FOUND: "Duplicates found in items",
  ID_TYPE_INVALID: "Id type must be a number or a string",
};

type RootId = typeof ROOT_ID;
type Id = number | string;
type RequiredFields = "id" | "parent" | "type";
interface TreeItemInterface {
  id: Id;
  parent: RootId | Id;
  type?: unknown;
}
type TreeItem = Partial<TreeItemInterface> &
  Pick<TreeItemInterface, RequiredFields> &
  Record<PropertyKey, unknown>;
type MappedItem = Omit<TreeItem, "id">;
type MappedItemStorage = Map<Id, MappedItem>;

type TreeStoreOptions = {
  ignoreDuplicates?: boolean;
  ignoreRoot?: boolean;
  ignoreIdType?: boolean;
};

interface TreeStoreInterface {
  getAll: () => TreeItem[];
  getItem: (id: Id) => TreeItem | null;
  getChildren: (id: Id) => TreeItem[];
  getAllChildren: (id: Id) => TreeItem[];
  getAllParents: (id: Id) => TreeItem[];
}

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

  private checkIdType(id: Id) {
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
  getItem: (id: Id) => null;
  getChildren: (id: Id) => [];
  getAllChildren: (id: Id) => [];
  getAllParents: (id: Id) => [];
}

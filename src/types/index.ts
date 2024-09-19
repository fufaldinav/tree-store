import { ROOT_ID } from "../constants";

type RootId = typeof ROOT_ID;
type Id = number | string;
type RequiredFields = "id" | "parent" | "type";
interface TreeItemInterface {
  id: Id;
  parent: RootId | Id;
  type?: unknown;
}
export type TreeItem = Partial<TreeItemInterface> &
  Pick<TreeItemInterface, RequiredFields> &
  Record<PropertyKey, unknown>;
type MappedItem = Omit<TreeItem, "id">;
export type MappedItemStorage = Map<Id, MappedItem>;

export type TreeStoreOptions = {
  ignoreDuplicates?: boolean;
  ignoreRoot?: boolean;
  ignoreIdType?: boolean;
};

export interface TreeStoreInterface {
  getAll: () => TreeItem[];
  getItem: (id: Id) => TreeItem | null;
  getChildren: (id: Id) => TreeItem[];
  getAllChildren: (id: Id) => TreeItem[];
  getAllParents: (id: Id) => TreeItem[];
}

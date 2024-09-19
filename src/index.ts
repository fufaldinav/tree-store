const ROOT_ID = "root";

type RootId = typeof ROOT_ID;
type Id = number | string;
type TreeItem = {
  id: Id;
  parent: RootId | Id;
  type: unknown;
};

interface TreeStoreInterface {
  getAll: () => TreeItem[];
  getItem: (id: Id) => TreeItem | null;
  getChildren: (id: Id) => TreeItem[];
  getAllChildren: (id: Id) => TreeItem[];
  getAllParents: (id: Id) => TreeItem[];
}

export class TreeStore implements TreeStoreInterface {
  constructor() {}
  getAll: () => [];
  getItem: (id: Id) => null;
  getChildren: (id: Id) => [];
  getAllChildren: (id: Id) => [];
  getAllParents: (id: Id) => [];
}

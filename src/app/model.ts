export interface Stats {
  pwd: string;
  hasProfile: boolean;
  buildVersion: string;
  buildCommit: string;
  buildDate: string;
  builtBy: string;
}

export interface ItemRequest {
  items: Item[];
  equipped: EquippedItem[];
  active: number[];
}

export interface EquippedItem {
  inventory_list_index: number;
  enabled: boolean;
  slot_data_path: string;
  trinket_data_path: string;
}

export interface Item {
  level: number;
  balance: string;
  manufacturer: string;
  inv_data: string;
  parts: string[];
  generics: string[];
  overflow: string;
  version: number;
  readonly wrapper: ItemWrapper;
}

export interface ItemWrapper {
  readonly item_serial_number: string;
  readonly pickup_order_index: number;
}


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

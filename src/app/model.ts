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
export interface Save {

}
export interface Wrapper {
  save: Save;
}
export interface CharacterWrapper extends Wrapper {
  character: Character;
}

export interface ProfileWrapper extends Wrapper {
  profile: Profile;
}

export interface Character {
  experience_points: number;
  inventory_category_list: {base_category_definition_hash: number, quantity: number}[];
  equipped_inventory_list: EquippedInventoryItem[];
  sdu_list: {
    sdu_level: number;
    sdu_data_path: string;
  }[];
}

// tslint:disable-next-line:no-empty-interface
export interface Profile {

}

export interface EquippedInventoryItem {
  inventory_list_index: number;
  enabled: boolean;
  slot_data_path: string;
}

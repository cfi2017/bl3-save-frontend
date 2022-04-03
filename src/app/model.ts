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
  serialVersion: number;
  readonly wrapper: ItemWrapper;
}

export interface ItemWrapper {
  readonly item_serial_number: string;
  readonly pickup_order_index: number;
}
// tslint:disable-next-line:no-empty-interface
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
  player_class_data: {
    player_class_path: string;
  };
  vehicles_unlocked_data: {
    asset_path: string;
    just_unlocked: boolean;
  }[];
  game_state_save_data_for_playthrough: {
    mayhem_level: number;
    mayhem_random_seed: number;
  }[];
  vehicle_parts_unlocked: string[];
  ability_data: {
    ability_points: number;
    tree_item_list: {
      item_asset_path: string;
      points: number;
      max_points: number;
    }[];
    ability_slot_list: {
      ability_class_path: string;
      slot_asset_path: string;
    }[];
    augment_slot_list: {
      action_ability_class_path: string;
      slot_asset_path: string;
      augment_asset_path: string;
    }[];
  };
  hero_points_save_data: {
    strength: number;
    luck: number;
    dexterity: number;
    intelligence: number;
    wisdom: number;
    constitution: number;
  };
}

// tslint:disable-next-line:no-empty-interface
export interface Profile {
  CitizenScienceCSBucksAmount: number;
  unlocked_crew_quarters_decorations: {
    is_new: boolean;
    decoration_item_asset_path: string;
  };
  unlocked_customizations: {
    is_new: boolean;
    customization_asset_path: string;
  };
  unlocked_inventory_customization_parts: {
    is_new: boolean;
    customization_asset_hash: number;
  }[];
  guardian_rank: {
    available_tokens: number;
    guardian_rank: number;
    rank_rewards: {
      num_tokens: number;
      reward_data_path: string;
    }[];
    guardian_reward_random_seed: number;
    new_guardian_experience: number;
  };
  profile_sdu_list: {
    sdu_level: number;
    sdu_data_path: string;
  }[];
  vault_card: {
    last_active_vault_card_id: number;
    current_day_seed: number;
    current_week_seed: number;
    vault_card_previous_challenges: {
      previous_challenge_seed: number;
      previous_challenge_id: number;
    }[];
    vault_card_claimed_rewards: {
      vault_card_id: number;
      vault_card_experience: number;
      unlocked_reward_list: VaultCardReward[];
      redeemed_reward_list: VaultCardReward[];
      vault_card_chests: number;
      vault_card_chests_opened: number;
      vault_card_keys_spent: number;
      gear_rewards: VaultCardGearReward[];
    }[];
  };
  bank_inventory_category_list: {
    base_category_definition_hash: number;
    quantity: number;
  }[];
}

export interface VaultCardReward {
  column_index: number;
  row_index: number;
}

export interface VaultCardGearReward {
  gear_index: number;
  repurchase_count: number;
}

export interface EquippedInventoryItem {
  inventory_list_index: number;
  enabled: boolean;
  slot_data_path: string;
}

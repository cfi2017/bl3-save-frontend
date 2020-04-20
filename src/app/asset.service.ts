import { Injectable, OnInit } from '@angular/core';

import db from '../assets/inventory_raw.json';
import btik from '../assets/balance_to_inv_key.json';
import names from '../assets/short_name_balance_mapping.json';


@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor() {

  }

  getAssetsForKey(key: string): string[] {
    return db[key] ? db[key].assets : [];
  }

  getAssets(balance: string): string[] {
    const key = this.getInvKey(balance.toLowerCase());
    return db[key] ? db[key].assets : [];
  }

  getInvKey(balance: string): string {
    return btik[balance];
  }

  getName(balance: string): string {
    return names[balance.toLowerCase()] || balance;
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { ProfileWrapper } from '../model';

@Component({
  selector: 'bls-profile-form',
  template: `
    <form
      gdColumns="33% 33% 33%!"
      gdRows="330px!"
      gdAreas="guardian guardian guardian | citizen_science currencies ." gdGap="10px">
      <!-- Guardian Ranks -->
      <mat-card gdArea="guardian">
        <mat-card-title>Guardian Rank</mat-card-title>
        <mat-card-content
          gdColumns="16% 16% 16% 16% 16% 16%!"
          gdRows="20% 20% 20% 20%!"
          gdAreas="level rank0 rank4 rank8 rank12 rank16 |
          tokens rank1 rank5 rank9 rank13 rank17 |
          . rank2 rank6 rank10 rank14 rank18 |
          . rank3 rank7 rank11 rank15 rank19 |
          . . . . experience experience"
          gdGap="0.8%"
        >
          <mat-form-field gdArea="level">
            <input matInput type="number" [(ngModel)]="data.profile.guardian_rank.guardian_rank" name="guardian_rank"/>
            <mat-label>Guardian Rank</mat-label>
          </mat-form-field>
          <mat-form-field gdArea="experience">
            <input matInput [max]="maxInt" 
                   type="number" [(ngModel)]="data.profile.guardian_rank.new_guardian_experience" name="new_guardian_experience"/>
            <mat-label>Guardian Experience</mat-label>
          </mat-form-field>
          <mat-form-field gdArea="tokens">
            <input matInput type="number" [(ngModel)]="data.profile.guardian_rank.available_tokens" name="guardian_tokens"/>
            <mat-label>Guardian Tokens</mat-label>
          </mat-form-field>
          <mat-form-field *ngFor="let rank of data.profile.guardian_rank.rank_rewards; let i = index" [gdArea]="'rank' + i">
            <input matInput type="number" [(ngModel)]="rank.num_tokens" [name]="rank.reward_data_path"/>
            <mat-label>{{rank.reward_data_path | asset:'_'}}</mat-label>
          </mat-form-field>
        </mat-card-content>
      </mat-card>
      <!-- Misc -->
      <!-- Citizen Science -->
      <mat-card gdArea="citizen_science">
        <mat-card-title>Citizen Science</mat-card-title>
        <mat-card-content>
          <div>
            <mat-form-field>
              <input matInput name="science_tokens" type="number"
                     [(ngModel)]="data.profile.CitizenScienceCSBucksAmount"/>
              <mat-label>Citizen Science Bucks</mat-label>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>
      <mat-card gdArea="currencies">
        <mat-card-title>Currencies</mat-card-title>
        <mat-card-content>
          <mat-form-field>
            <input matInput type="number" [(ngModel)]="goldenKeys"
                   name="golden_keys"/>
            <mat-label>Golden Keys</mat-label>
          </mat-form-field>
          <mat-form-field>
            <input matInput type="number" [(ngModel)]="diamondKeys"
                   name="diamond_keys"/>
            <mat-label>Diamond Keys</mat-label>
          </mat-form-field>
          <mat-form-field>
            <input matInput type="number" [(ngModel)]="vaultCards"
                   name="vault_cards"/>
            <mat-label>Vault Cards</mat-label>
          </mat-form-field>
          <mat-form-field *ngIf="data.profile?.vault_card?.vault_card_claimed_rewards[0]">
            <input matInput type="number" [(ngModel)]="data.profile.vault_card.vault_card_claimed_rewards[0].vault_card_chests"
                   name="vault_card_chests"/>
            <mat-label>Vault Card Chests</mat-label>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

    </form>
  `,
  styles: [],
})
export class ProfileFormComponent implements OnInit {

  @Input()
  data: ProfileWrapper;
  maxInt = Number.MAX_SAFE_INTEGER;

  get goldenKeys(): number {
    if (!this.data.profile.bank_inventory_category_list) {
      this.data.profile.bank_inventory_category_list = [];
    }
    const keyObj = this.data.profile.bank_inventory_category_list.find(obj => obj.base_category_definition_hash === 4031389239);
    if (!keyObj) return 0;
    return keyObj.quantity;
  }
  set goldenKeys(keys: number) {
    if (!this.data.profile.bank_inventory_category_list) {
      this.data.profile.bank_inventory_category_list = [];
    }
    const keyObj = this.data.profile.bank_inventory_category_list.find(obj => obj.base_category_definition_hash === 4031389239);
    if (!keyObj) this.data.profile.bank_inventory_category_list.push({
      base_category_definition_hash: 4031389239,
      quantity: keys
    });
    else keyObj.quantity = keys;
  }
  get diamondKeys(): number {
    if (!this.data.profile.bank_inventory_category_list) {
      this.data.profile.bank_inventory_category_list = [];
    }
    const keyObj = this.data.profile.bank_inventory_category_list.find(obj => obj.base_category_definition_hash === 2268671775);
    if (!keyObj) return 0;
    return keyObj.quantity;
  }
  set diamondKeys(keys: number) {
    if (!this.data.profile.bank_inventory_category_list) {
      this.data.profile.bank_inventory_category_list = [];
    }
    const keyObj = this.data.profile.bank_inventory_category_list.find(obj => obj.base_category_definition_hash === 2268671775);
    if (!keyObj) this.data.profile.bank_inventory_category_list.push({
      base_category_definition_hash: 2268671775,
      quantity: keys
    });
    else keyObj.quantity = keys;
  }
  get vaultCards(): number {
    if (!this.data.profile.bank_inventory_category_list) {
      this.data.profile.bank_inventory_category_list = [];
    }
    const keyObj = this.data.profile.bank_inventory_category_list.find(obj => obj.base_category_definition_hash === 3707609395);
    if (!keyObj) return 0;
    return keyObj.quantity;
  }
  set vaultCards(keys: number) {
    if (!this.data.profile.bank_inventory_category_list) {
      this.data.profile.bank_inventory_category_list = [];
    }
    const keyObj = this.data.profile.bank_inventory_category_list.find(obj => obj.base_category_definition_hash === 3707609395);
    if (!keyObj) this.data.profile.bank_inventory_category_list.push({
      base_category_definition_hash: 3707609395,
      quantity: keys
    });
    else keyObj.quantity = keys;
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}

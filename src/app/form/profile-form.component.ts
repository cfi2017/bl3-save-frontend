import { Component, Input, OnInit } from '@angular/core';
import { ProfileWrapper } from '../model';

@Component({
  selector: 'bls-profile-form',
  template: `
    <form
      gdColumns="33% 33% 33%!"
      gdRows="300px!"
      gdAreas="guardian guardian guardian | citizen_science vault_card ." gdGap="10px">
      <!-- Guardian Ranks -->
      <mat-card gdArea="guardian">
        <mat-card-title>Guardian Rank</mat-card-title>
        <mat-card-content
          gdColumns="16% 16% 16% 16% 16% 16%!"
          gdRows="20% 20% 20% 20%!"
          gdAreas="level rank0 rank4 rank8 rank12 rank16 |
          tokens rank1 rank5 rank9 rank13 rank17 |
          . rank2 rank6 rank10 rank14 rank18 |
          . rank3 rank7 rank11 rank15 rank19"
          gdGap="0.8%"
        >
          <mat-form-field gdArea="level">
            <input matInput type="number" [(ngModel)]="data.profile.guardian_rank.guardian_rank" name="guardian_rank"/>
            <mat-label>Guardian Rank</mat-label>
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
      <mat-card gdArea="vault_card" *ngIf="data.profile?.vault_card?.vault_card_claimed_rewards[0]">
        <mat-card-title>Vault Cards</mat-card-title>
        <mat-card-content>
            <mat-form-field>
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

  constructor() {
  }

  ngOnInit(): void {
  }

}

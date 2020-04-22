import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bls-profile-form',
  template: `
    <form>
      <mat-form-field>
        <input matInput name="science_tokens" type="number"
               [(ngModel)]="data.profile.CitizenScienceCSBucksAmount" />
        <mat-label>Citizen Science Bucks</mat-label>
      </mat-form-field>
    </form>
  `,
  styles: []
})
export class ProfileFormComponent implements OnInit {

  @Input()
  data: any;

  constructor() { }

  ngOnInit(): void {
  }

}

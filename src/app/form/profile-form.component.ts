import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bls-profile-form',
  template: `
    <form>
      <mat-form-field>
        <input matInput name="" />
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

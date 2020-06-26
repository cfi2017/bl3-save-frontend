import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bls-mass-item-level-dialog',
  template: `
    <h2 mat-dialog-title>Update Level of all Items</h2>
    <mat-dialog-content fxLayout="column">
      <span>Please note that you still need to save after pressing "Set".</span>
      <mat-form-field>
        <input matInput [(ngModel)]="data.level" name="level" />
        <mat-label>Level</mat-label>
      </mat-form-field>
      <mat-checkbox [(ngModel)]="data.mayhem" labelPosition="after">Change mayhem level (where possible)</mat-checkbox>
      <mat-form-field>
        <input matInput [disabled]="!data.mayhem" type="number" max="10" min="0" [(ngModel)]="data.mayhemLevel" name="mayhemLevel" />
        <mat-label>Mayhem Level</mat-label>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button color="primary" [matDialogClose]="data">Set</button>
      <button mat-button matDialogClose>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class MassItemLevelDialogComponent implements OnInit {

  data = {
    level: 60,
    mayhemLevel: 10,
    mayhem: false
  };

  constructor() { }

  ngOnInit(): void {
  }

}

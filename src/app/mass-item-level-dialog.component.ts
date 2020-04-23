import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bls-mass-item-level-dialog',
  template: `
    <h2 mat-dialog-title>Update Level of all Items</h2>
    <mat-dialog-content fxLayout="column">
      <span>Please note that you still need to save after pressing "Set".</span>
      <mat-form-field>
        <input matInput [(ngModel)]="level" name="level" />
        <mat-label>Level</mat-label>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button color="primary" [matDialogClose]="level">Set</button>
      <button mat-button matDialogClose>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class MassItemLevelDialogComponent implements OnInit {

  level = 57;

  constructor() { }

  ngOnInit(): void {
  }

}

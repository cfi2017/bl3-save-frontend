import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'bls-developer-message',
  template: `
    <h1 mat-dialog-title>Developer Message</h1>
    <div mat-dialog-content>
      {{data}}
    </div>
    <mat-dialog-actions>
      <button mat-raised-button matDialogClose>Close</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class DeveloperMessageComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}

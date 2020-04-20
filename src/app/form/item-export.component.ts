import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '../model';

@Component({
  selector: 'bls-item-export',
  template: `
    <mat-dialog-content>
      <pre>
        bl3({{data.wrapper.item_serial_number}})
      </pre>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matDialogClose>Close</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class ItemExportComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Item
  ) { }

  ngOnInit(): void {
  }

}

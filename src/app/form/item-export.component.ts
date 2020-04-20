import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '../model';

@Component({
  selector: 'bls-item-export',
  template: `
    <mat-dialog-content>
      <mat-form-field style="width: 100%;">
        <textarea rows="5" readonly matInput name="code"
                  (click)="box.select()" #box class="code">bl3({{data.wrapper.item_serial_number}})</textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button matDialogClose>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
    .code {
      font-family: Consolas,monospace;
      background-color: rgba(0, 0, 0, 0.1);
    }
    `
  ]
})
export class ItemExportComponent implements OnInit, AfterViewInit {

  @ViewChild('box')
  box: ElementRef<HTMLTextAreaElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Item
  ) { }

  ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    this.box.nativeElement.focus();
    this.box.nativeElement.select();
  }

}

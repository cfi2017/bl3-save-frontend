import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bls-item-import',
  template: `
    <mat-dialog-content>
      <form>
        <mat-form-field>
          <textarea #codeField="ngModel" required matInput [(ngModel)]="code" name="code" rows="5"></textarea>
          <mat-label>bl3 code (base64)</mat-label>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button [disabled]="codeField.invalid" [matDialogClose]="code">Import</button>
      <button mat-button matDialogClose>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
    mat-dialog-content {
      width: 100%;
    }
    form {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }
    `
  ]
})
export class ItemImportComponent implements OnInit {

  code = '';

  constructor() { }

  ngOnInit(): void {
  }

}

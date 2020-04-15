import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../model';
import { AssetService } from '../asset.service';
import { MatDialog } from '@angular/material/dialog';
import { PartPickerComponent } from './part-picker.component';

@Component({
  selector: 'bls-item-form',
  template: `
    <form>
      <div>
        <mat-form-field>
          <input matInput
                 name="level"
                 #level="ngModel"
                 [(ngModel)]="data.level"
                 type="number"
                 max="57"
                 min="1"/>
          <mat-label>Level</mat-label>
          <mat-error *ngIf="level.hasError('max')">Level can't be over 57.</mat-error>
          <mat-error *ngIf="level.hasError('min')">Level must be at least 1.</mat-error>
        </mat-form-field>
      </div>

      <div style="margin-bottom:5px;">
        <bls-part-picker max="63" [pickedParts]="data.parts" [availableParts]="availableParts"></bls-part-picker>
      </div>
      <div>
        <bls-part-picker max="15" [pickedParts]="data.generics"
                         partTitle="Anointments" [availableParts]="availableGenerics"></bls-part-picker>
      </div>
      <pre>{{data | json}}</pre>
    </form>
  `,
  styles: [
    `
    `
  ]
})
export class ItemFormComponent implements OnInit {

  availableParts: string[];
  availableGenerics: string[];

  @Input()
  data: Item;

  constructor(
    private assets: AssetService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.availableParts = [...this.assets.getAssets(this.data.balance.toLowerCase())];
    this.availableGenerics = [...this.assets.getAssetsForKey('InventoryGenericPartData')];

  }

}

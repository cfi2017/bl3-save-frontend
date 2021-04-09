import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Item } from '../model';
import { AssetService } from '../asset.service';
import { MatDialog } from '@angular/material/dialog';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ConfigService } from '../config.service';
import { BalancePickerComponent } from './balance-picker.component';
import { filter } from 'rxjs/operators';
import {
  BALANCE_BLACKLIST,
  bestGuessManufacturer,
  filterBlacklist,
  INV_DATA_BLACKLIST,
  MANUFACTURER_BLACKLIST
} from '../const';

@Component({
  selector: 'bls-item-form',
  template: `
    <form>
      <div>
        <mat-expansion-panel #generalPanel class="mat-elevation-z3">
          <mat-expansion-panel-header>
            <mat-panel-title>General</mat-panel-title>
          </mat-expansion-panel-header>
          <div
            *ngIf="generalPanel.expanded"
            gdColumns="33% 33% 33%!"
            gdRows="50px!"
            gdAreas="item_level actions actions |
            balance balance balance |
            inv_data inv_data inv_data |
            manufacturer manufacturer manufacturer"
            gdGap="0.5%">
            <mat-form-field gdArea="item_level">
              <input matInput
                     name="level"
                     #level="ngModel"
                     [(ngModel)]="data.level"
                     type="number"
                     max="65"
                     min="1"/>
              <mat-label>Level</mat-label>
              <mat-error *ngIf="level.hasError('max')">Level can't be over 60.</mat-error>
              <mat-error *ngIf="level.hasError('min')">Level must be at least 1.</mat-error>
            </mat-form-field>
            <div gdArea="actions">
              <button mat-raised-button color="primary" (click)="openChangeBalanceDialog()">Change Balance</button>
            </div>
            <mat-form-field gdArea="balance">
              <mat-select
                     name="balance"
                     [(ngModel)]="data.balance"
                     disabled>
                <mat-option [value]="data.balance">{{data.balance | asset:'.'}}</mat-option>
              </mat-select>
              <mat-label>Balance</mat-label>
            </mat-form-field>
            <mat-form-field gdArea="inv_data">
              <mat-select #invDataSelect
                     name="inv_data"
                     [(ngModel)]="data.inv_data">
                <ng-container *ngFor="let a of filter(assets.getAssetsForKey('InventoryData'), invBlacklist)">
                  <mat-option [value]="a">{{a | asset:'.'}}</mat-option>
                </ng-container>
              </mat-select>
              <mat-label>Inventory Data</mat-label>
            </mat-form-field>
            <mat-form-field gdArea="manufacturer">
              <mat-select #manufacturerSelect
                          name="manufacturer"
                          [(ngModel)]="data.manufacturer">
                <ng-container *ngFor="let a of filter(assets.getAssetsForKey('ManufacturerData'), manBlacklist)">
                  <mat-option [value]="a" *ngIf="manufacturerSelect.panelOpen || a === data.manufacturer">{{a | asset:'.'}}</mat-option>
                </ng-container>
              </mat-select>
              <mat-label>Manufacturer</mat-label>
            </mat-form-field>
          </div>
        </mat-expansion-panel>
      </div>

      <div *ngIf="data.parts" style="margin-top:5px;">
        <bls-part-picker max="63" [pickedParts]="data.parts" [availableParts]="availableParts"></bls-part-picker>
      </div>
      <div *ngIf="data.generics" style="margin-top:5px;">
        <bls-part-picker max="15" [pickedParts]="data.generics" exclusive="true"
                         partTitle="Anointments" [availableParts]="availableGenerics"></bls-part-picker>
      </div>
      <div *ngIf="config.advanced" style="margin-top:5px;">
        <mat-expansion-panel class="mat-elevation-z3">
          <mat-expansion-panel-header>
            <mat-panel-title>JSON Inspector</mat-panel-title>
          </mat-expansion-panel-header>
          <json-editor *ngIf="config.advanced" style="height:100%;" [data]="data" [options]="editorOptions"></json-editor>
        </mat-expansion-panel>
      </div>
    </form>
  `,
  styles: [
      `
      bls-part-picker {
        width: 100%;
      }
    `,
  ],
})
export class ItemFormComponent implements OnInit {

  availableParts: string[];
  availableGenerics: string[];

  manBlacklist = MANUFACTURER_BLACKLIST;
  invBlacklist = INV_DATA_BLACKLIST;

  @Input()
  data: Item;

  debug = false;
  editorOptions: JsonEditorOptions;

  @ViewChild(JsonEditorComponent, { static: true })
  editor: JsonEditorComponent;

  constructor(
    public assets: AssetService,
    public config: ConfigService,
    private dialog: MatDialog,
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'view';
    this.editorOptions.modes = [/*'code', 'text', 'tree', */'view'];
  }

  ngOnInit(): void {
    this.debug = !!localStorage.getItem('debug');
    this.availableParts = [...this.assets.getAssets(this.data.balance.toLowerCase())];
    this.availableGenerics = [...this.assets.getAssetsForKey('InventoryGenericPartData')];
    this.data.generics = this.data.generics || [];
    this.data.parts = this.data.parts || [];
  }

  public openChangeBalanceDialog() {
    this.dialog.open(BalancePickerComponent, {
      width: '80%',
      data: {
        initial: this.data.balance,
        options: this.assets.getAssetsForKey('InventoryBalanceData'),
        blacklist: BALANCE_BLACKLIST
      }
    }).afterClosed()
      .pipe(
        filter(res => !!res),
      )
      .subscribe(res => this.changeBalance(res));
  }

  private changeBalance(balance: string) {
    this.data.balance = balance;
    this.data.parts = [];
    this.availableParts = [...this.assets.getAssets(this.data.balance.toLowerCase())];
    this.data.manufacturer = bestGuessManufacturer(this.data.balance, this.data.manufacturer);
  }


  public filter(d: string[], b: string[]) {
    return filterBlacklist(d, b);
  }
}

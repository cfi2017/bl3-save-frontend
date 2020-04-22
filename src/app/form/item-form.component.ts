import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Item } from '../model';
import { AssetService } from '../asset.service';
import { MatDialog } from '@angular/material/dialog';
import { PartPickerComponent } from './part-picker.component';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ConfigService } from '../config.service';

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

      <div *ngIf="data.parts">
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
    `
  ]
})
export class ItemFormComponent implements OnInit {

  availableParts: string[];
  availableGenerics: string[];

  @Input()
  data: Item;

  debug = false;
  editorOptions: JsonEditorOptions;

  @ViewChild(JsonEditorComponent, {static: true})
  editor: JsonEditorComponent;

  constructor(
    private assets: AssetService,
    public config: ConfigService
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'view';
    this.editorOptions.modes = [/*'code', 'text', 'tree', */'view'];
  }

  ngOnInit(): void {
    this.debug = !!localStorage.getItem('debug');
    this.availableParts = [...this.assets.getAssets(this.data.balance.toLowerCase())];
    this.availableGenerics = [...this.assets.getAssetsForKey('InventoryGenericPartData')];

  }

}

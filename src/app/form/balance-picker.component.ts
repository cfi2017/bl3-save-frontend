import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'bls-balance-picker',
  template: `
    <h2 mat-dialog-title>Choose a {{data.title || 'Balance'}}</h2>
    <mat-dialog-content fxLayout="column">
      <mat-form-field style="width: 100%;">
        <mat-label>Type</mat-label>
        <mat-select [(ngModel)]="type" (selectionChange)="selectType()">
          <mat-option [value]="[]">None</mat-option>
          <mat-option [value]="['Grenade']">Grenades</mat-option>
          <mat-option [value]="['ClassMod']">Class Mods</mat-option>
          <mat-option [value]="['Artifact']">Artifacts</mat-option>
          <mat-option [value]="['_AR_']">Assault Rifles</mat-option>
          <mat-option [value]="['_PS_']">Pistols</mat-option>
          <mat-option [value]="['_SM_']">SMGs</mat-option>
          <mat-option [value]="['_HW_']">Heavy Weapons</mat-option>
          <mat-option [value]="['_SG_']">Shotguns</mat-option>
          <mat-option [value]="['_SR_']">Sniper Rifles</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field style="width: 100%;">
        <mat-label>Balance</mat-label>
        <mat-select [disabled]="type.length === 0" [(ngModel)]="balance">
          <mat-option *ngFor="let opt of selected" [value]="opt">{{opt | asset:'.'}}</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button color="primary" [disabled]="balance === ''" [mat-dialog-close]="balance">Submit</button>
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class BalancePickerComponent implements OnInit {

  options: string[];
  selected: string[];
  blacklist: string[];
  type = [];
  balance = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {title: string; initial: string, options: string[], blacklist: string[]}
  ) {
    // this.balance = data.initial;
    this.options = data.options.sort();
    this.blacklist = data.blacklist;
    // this.selected = this.ff(this.options, this.blacklist);
  }

  ngOnInit(): void {
  }

  ff(d: string[], b: string[]): string[] {
    return d.filter(e => !b.some(bi => e.includes(bi)));
  }

  fi(d: string[], b: string[]): string[] {
    return d.filter(e => b.some(bi => e.includes(bi)));
  }

  public selectType() {
    if (this.type.length === 0) {
      this.balance = '';
      this.selected = [];
    } else this.selected = this.fi(this.ff(this.options, this.blacklist), this.type);
  }
}

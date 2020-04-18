import { Component, Input, OnInit } from '@angular/core';
import { CURRENCIES, getExpForLevel, getLevelForExp } from '../const';

@Component({
  selector: 'bls-character-form',
  template: `
    <form>
      <mat-form-field>
        <input matInput
               name="level"
               #lvl="ngModel"
               [(ngModel)]="level"
               type="number"
               max="57"
               min="1"/>
        <mat-label>Level</mat-label>
      </mat-form-field>
      <mat-form-field>
        <input matInput
               name="money"
               [(ngModel)]="money"
               type="number"/>
        <mat-label>Money</mat-label>
      </mat-form-field>
      <mat-form-field>
        <input matInput
               name="eridium"
               [(ngModel)]="eridium"
               type="number"/>
        <mat-label>Eridium</mat-label>
      </mat-form-field>
    </form>
  `,
  styles: []
})
export class CharacterFormComponent implements OnInit {

  @Input()
  data: any;

  get level(): number {
    return getLevelForExp(this.data.character.experience_points);
  }
  set level(l: number) {
    this.data.character.experience_points = getExpForLevel(l);
  }

  get eridium(): number {
    if (this.data.character.inventory_category_list.filter(l => l.base_category_definition_hash === CURRENCIES.eridium).length === 0) {
      this.data.character.inventory_category_list.push({
        base_category_definition_hash: CURRENCIES.eridium,
        quantity: 0
      });
    }
    return this.data.character.inventory_category_list.filter(l => l.base_category_definition_hash === CURRENCIES.eridium)[0].quantity;
  }
  set eridium(e: number) {
    if (this.data.character.inventory_category_list.filter(l => l.base_category_definition_hash === CURRENCIES.eridium).length === 0) {
      this.data.character.inventory_category_list.push({
        base_category_definition_hash: CURRENCIES.eridium,
        quantity: 0
      });
    }
    this.data.character.inventory_category_list.filter(l => l.base_category_definition_hash === CURRENCIES.eridium)[0].quantity = e;
  }
  get money(): number {
    return this.data.character.inventory_category_list.filter(l => l.base_category_definition_hash === CURRENCIES.money)[0].quantity;
  }
  set money(m: number) {
    this.data.character.inventory_category_list.filter(l => l.base_category_definition_hash === CURRENCIES.money)[0].quantity = m;
  }

  constructor() { }

  ngOnInit(): void {
  }

}

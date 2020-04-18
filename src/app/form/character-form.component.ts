import { Component, Input, OnInit } from '@angular/core';
import { getExpForLevel, getLevelForExp } from '../const';

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

  constructor() { }

  ngOnInit(): void {
  }

}

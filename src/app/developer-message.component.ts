import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'bls-developer-message',
  template: `
    <h1 mat-dialog-title>Developer Message</h1>
    <div mat-dialog-content>
      <section *ngFor="let c of data.content">
        <h2 *ngIf="c.title">{{c.title}}</h2>
        <p [innerHTML]="c.text"></p>
      </section>
    </div>
    <mat-dialog-actions>
      <button style="margin-right:5px;" mat-raised-button matDialogClose>Close</button>
      <mat-checkbox (change)="toggleNoShow($event)">Don't show this again.</mat-checkbox>
    </mat-dialog-actions>
  `,
  styles: []
})
export class DeveloperMessageComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string, content: {title?: string, text: string}[] }
  ) { }

  ngOnInit(): void {
  }

  public toggleNoShow(e: MatCheckboxChange) {
    const rawCache = localStorage.getItem('suppressMessage');
    let cache;
    if (!rawCache) cache = {};
    else cache = JSON.parse(rawCache);
    cache[this.data.id] = e.checked;
    localStorage.setItem('suppressMessage', JSON.stringify(cache));
  }
}

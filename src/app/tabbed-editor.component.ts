import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bls-tabbed-editor',
  template: `
    <mat-tab-group>
      <mat-tab>
        <ng-content select="main"></ng-content>
      </mat-tab>
      <mat-tab>
        <ng-content select="items"></ng-content>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: []
})
export class TabbedEditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

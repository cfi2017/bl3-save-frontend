import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bls-default',
  template: `
    <h2>Borderlands 3 Save Editor</h2>
    <p style="height: 50vh;">
      Please choose a save file on the left.
    </p>
  `,
  styles: []
})
export class DefaultComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

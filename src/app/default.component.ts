import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bls-default',
  template: `
    <p style="height: 50vh;">
      default works!
    </p>
  `,
  styles: []
})
export class DefaultComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

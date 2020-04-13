import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bls-character-frame',
  template: `

  `,
  styles: []
})
export class CharacterFrameComponent implements OnInit {

  @Input()
  character: CharacterData;

  constructor() { }

  ngOnInit(): void {
  }

}

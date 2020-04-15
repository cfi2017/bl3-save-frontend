import { Component, Input, OnInit } from '@angular/core';
import { ProxyService } from './proxy.service';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bls-character-frame',
  template: `
    <pre style="min-height: 300px;">
      {{data | json}}
    </pre>
  `,
  styles: []
})
export class CharacterFrameComponent implements OnInit {

  @Input()
  data: any;

  constructor(
    private proxy: ProxyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.proxy.getCharacter(id)),
      )
      .subscribe(char => this.data = char);
  }

}

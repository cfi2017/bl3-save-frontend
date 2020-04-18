import { Component, OnInit } from '@angular/core';
import { ProxyService } from './proxy.service';

@Component({
  selector: 'bls-profile-frame',
  template: `
    <bls-profile-form [data]="data"></bls-profile-form>
    <pre style="min-height: 300px;">
      {{data | json}}
    </pre>
  `,
  styles: []
})
export class ProfileFrameComponent implements OnInit {

  data: any;

  constructor(
    private proxy: ProxyService
  ) { }

  ngOnInit(): void {
    this.proxy.getProfile().subscribe(profile => this.data = profile);
  }

}

import { Component, OnInit } from '@angular/core';
import { ProxyService } from './proxy.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from './config.service';
import { SaveService } from './save.service';
import { CharacterWrapper, Item, ProfileWrapper } from './model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'bls-proxy-load',
  template: `
    <bls-character-frame *ngIf="mode === 'character'" [load]="load" [save]="save"></bls-character-frame>
    <bls-profile-frame *ngIf="mode === 'profile'" [load]="load" [save]="save"></bls-profile-frame>
    <bls-bank-frame *ngIf="mode === 'bank'" [load]="load" [save]="save"></bls-bank-frame>
    <bls-items-frame *ngIf="mode === 'items'" [load]="load" [save]="save"></bls-items-frame>
  `,
  styles: []
})
export class ProxyLoadComponent implements OnInit {

  mode: 'profile'|'character'|'bank'|'items' = null;
  save: (data: any) => Observable<any>;
  load: () => Observable<any>;

  constructor(
    private proxy: ProxyService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    public config: ConfigService,
    private saveService: SaveService
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.reset();
      if (url[0].path === 'profile') {
        if (url.length > 1 && url[1].path === 'bank') {
          // set save/load function
          // load bank
          this.load = () => this.proxy.getBankItems();
          this.save = items => this.proxy.updateBankItems(items);
          this.mode = 'bank';
        } else {
          // set save/load function
          // load profile
          this.load = () => this.proxy.getProfile();
          this.save = data => this.proxy.updateProfile(data);
          this.mode = 'profile';
        }
      } else if (url[0].path === 'character') {
        if (url.length > 2 && url[2].path === 'items') {
          // set save/load function
          // load items
          this.save = data => this.proxy.updateItems(data.id, data.items);
          this.load = () => {
            const id = this.route.snapshot.paramMap.get('id');
            return this.proxy.getItems(id).pipe(map(items => ({items, id})));
          };
          this.mode = 'items';
        } else {
          // set save/load function
          // load character
          this.save = (data) => this.proxy.updateCharacter(data.id, data.data);
          this.load = () => {
            const id = this.route.snapshot.paramMap.get('id');
            return this.proxy.getCharacter(id).pipe(
              map(char => ({char, id}))
            );
          };
          this.mode = 'character';
        }
      }
    });
    console.log(this.route.snapshot.url);
  }

  private reset() {

  }
}

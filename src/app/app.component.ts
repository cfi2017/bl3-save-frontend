import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProxyService } from './proxy.service';
import { untilComponentDestroyed } from './destroy-pipe';
import { MatSidenav } from '@angular/material/sidenav';
import { environment } from '../environments/environment';
import compareVersions from 'compare-versions';
import { ConfigService } from './config.service';

@Component({
  selector: 'bls-root',
  template: `
    <mat-toolbar color="primary" fxLayoutAlign="space-between" fxLayoutGap="30px">
      <div fxLayout="column" fxLayoutAlign="center">
        <h1>bl3-save editor</h1>
      </div>
      <div *ngIf="online" fxFlex="1 1 auto" fxLayout="row" fxLayoutGap="10px">
        <div fxFlex="5 1">
          <mat-form-field style="width: 100%;">
            <input name="dir" matInput [(ngModel)]="dir" />
            <mat-label>Save Directory</mat-label>
          </mat-form-field>
        </div>
        <div fxFlex="1 0" fxLayout="column" fxLayoutAlign="center">
          <button style="width: 80px;" (click)="cd()" mat-raised-button>Change</button>
        </div>
      </div>
      <div fxLayout="column" fxLayoutAlign="center">
        <mat-slide-toggle [(ngModel)]="config.advanced">Advanced Mode</mat-slide-toggle>
      </div>
    </mat-toolbar>
    <mat-toolbar *ngIf="outOfDate" color="warn">
      Your proxy version ({{version}}) is out of date. You need at least version {{minimumVersion}}.
    </mat-toolbar>
    <div style="width: 100%;">
      <mat-sidenav-container *ngIf="online && !outOfDate; else offline">
        <mat-sidenav style="min-width: 200px;" #nav mode="side" opened>
          <mat-nav-list>
            <mat-expansion-panel *ngIf="hasProfile">
              <mat-expansion-panel-header>
                <mat-panel-title>Profile</mat-panel-title>
              </mat-expansion-panel-header>
              <mat-nav-list>
                <a routerLink="profile" mat-list-item>Profile</a>
                <a routerLink="profile/bank" mat-list-item>Bank</a>
              </mat-nav-list>
            </mat-expansion-panel>
            <mat-expansion-panel
              *ngFor="let c of chars">
              <mat-expansion-panel-header>
                <mat-panel-title>{{c.name}} | Level {{c.experience | level}}</mat-panel-title>
              </mat-expansion-panel-header>
              <mat-nav-list>
                <a [routerLink]="'character/' + c.id" mat-list-item>Character</a>
                <a [routerLink]="'character/' + c.id + '/items'" mat-list-item>Items</a>
              </mat-nav-list>
            </mat-expansion-panel>
          </mat-nav-list>
        </mat-sidenav>
        <mat-sidenav-content>
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
      <ng-template #offline>
        <div>
          <mat-card>
            <mat-card-title>Installing the Proxy</mat-card-title>
            <mat-card-content>
              <mat-list>
                <mat-list-item>
                  Download the latest&nbsp;<a target="_blank" href="https://github.com/cfi2017/bl3-save/releases">Release</a>.
                </mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card>
          <mat-divider vertical inset></mat-divider>
          <mat-card></mat-card>
        </div>
      </ng-template>
    </div>
  `,
  styles: [],
})
export class AppComponent implements OnInit, OnDestroy {

  online = false;
  hasProfile = false;
  dir;
  chars: { name: string; experience: number; id: number }[];
  data: any;
  isCharacter = false;
  version: string;
  outOfDate = false;
  minimumVersion: string;

  @ViewChild(MatSidenav)
  nav: MatSidenav;

  constructor(
    private snackbar: MatSnackBar,
    private proxy: ProxyService,
    public config: ConfigService
  ) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.listChars();
    this.proxy.keepAlive().pipe(
      untilComponentDestroyed(this)
    ).subscribe(
      res => {
        if (this.dir === undefined) this.dir = res.pwd;
        this.snackbar.dismiss();
        this.hasProfile = res.hasProfile;
        if (this.online === false && !this.chars) this.listChars();
        this.online = true;
        this.version = res.buildVersion;
        this.checkVersion();
      },
      () => {
        this.online = false;
        this.snackbar.open(`Could not connect to local proxy.`);
        this.hasProfile = false;
      });
  }

  cd() {
    this.proxy.cd(this.dir).subscribe(() => {
      this.listChars();
    });
  }

  listChars() {
    this.proxy.getCharacters().subscribe(characters => this.chars = characters);
  }

  open(value: string) {
    if (value === 'profile') {
      this.proxy.getProfile().subscribe(profile => {
        this.data = profile;
        console.log(profile);
        this.isCharacter = false;
      });
    } else {
      this.proxy.getCharacter(value).subscribe(character => {
        this.data = character;
        console.log(character);
        this.isCharacter = true;
      });
    }
  }

  private checkVersion() {
    this.minimumVersion = environment.minimumVersion;
    if (!this.version) {
      this.outOfDate = true;
      this.version = '<= 1.0.3';
      return;
    }
    this.outOfDate = compareVersions(this.version, this.minimumVersion) === -1;
  }
}

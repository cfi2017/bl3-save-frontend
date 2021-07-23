import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ConfigService } from './config.service';
import { SaveService } from './save.service';
import { WasmService } from './wasm.service';
import { MatDialog } from '@angular/material/dialog';
import { DeveloperMessageComponent } from './developer-message.component';

@Component({
  selector: 'bls-root',
  template: `
    <mat-toolbar color="primary" fxLayoutAlign="space-between" fxLayoutGap="30px">
      <div fxLayout="column" fxLayoutAlign="center">
        <h1>bl3-save editor</h1>
      </div>
      <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
        <a mat-raised-button routerLink="/proxy">Proxy Editor (Recommended)</a>
        <a mat-raised-button routerLink="/nodownload">Browser Only</a>
        <bls-theme-picker></bls-theme-picker>
        <mat-slide-toggle [(ngModel)]="config.advanced">Advanced Mode</mat-slide-toggle>
      </div>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [
      `
      mat-sidenav-container {
        height: calc(100vh - 64px);
      }
    `,
  ],
})
export class AppComponent implements OnInit, OnDestroy {

  online = false;

  @ViewChild(MatSidenav)
  nav: MatSidenav;

  constructor(
    public config: ConfigService,
    private save: SaveService,
    private wasm: WasmService,
    private dialog: MatDialog,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    if (!JSON.parse(localStorage.getItem('suppressMessage'))?.welcome1) {
      this.dialog.open(DeveloperMessageComponent, {
        data: {
          id: 'welcome1', content: [
            {
              title: 'Baysix', text: `As you may have heard, Shawn,
        the author of the popular save editor bl3editor.com has recently passed away.
        This save editor will from this point on be dedicated to him.`,
            },
            {
              title: 'Open Source Commitment',
              text: `In lieu with the above news, I'm reiterating my intention that this save editor will remain 100% free and open source.
              <a href="https://github.com/cfi2017/bl3-save" target="_blank">The source code can be found here.</a>.`
            },
            {
              title: 'Browser Mode and PS4 Save Editing',
              text: `I've added support for editing PS4 save files and also a method of editing save files without downloading the client.
              Please click "Browser Only" in the top right for more information.`
            }
          ],
        },
      });
    }
    document.addEventListener('keyup', e => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.save.next(e);
      }
    });
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
      }
    });
    this.wasm.initialise()
      .then(() => console.log('wasm module ready'));
  }

}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProxyService } from './proxy.service';

@Component({
  selector: 'bls-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <mat-toolbar color="primary">
      bl3-save editor
      <ng-template *ngIf="online">
        <mat-form-field>
          <input matInput [(ngModel)]="dir" />
        </mat-form-field>
        <mat-select>
          <mat-option *ngFor="let c of chars">{{c.name}}</mat-option>
        </mat-select>
      </ng-template>
    </mat-toolbar>
    <div style="width: 100%;">
      <ng-template *ngIf="online; else offline">

      </ng-template>
      <ng-template #offline>
        <div>
          <mat-card>
            <mat-card-title>Installing the Proxy</mat-card-title>
            <mat-card-content>
              <mat-list>
                <mat-option>Download the latest Release.</mat-option>
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
export class AppComponent implements OnInit {

  online = false;
  dir = '';
  chars: { name: string; experience: number; id: number }[];

  constructor(
    private snackbar: MatSnackBar,
    private proxy: ProxyService
  ) { }

  public ngOnInit(): void {
    this.proxy.keepAlive().subscribe(
      () => {
        this.snackbar.dismiss();
        this.online = true;
      },
      () => {
        this.online = false;
        this.snackbar.open(`Could not connect to local proxy.`);
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

}

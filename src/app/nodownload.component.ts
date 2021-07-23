import { Component, OnInit } from '@angular/core';
import { FileInput } from 'ngx-material-file-input';
import { WasmService } from './wasm.service';
import { CharacterWrapper, Item, ItemRequest, ProfileWrapper } from './model';
import { Observable, of } from 'rxjs';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { DeveloperMessageComponent } from './developer-message.component';

@Component({
  selector: 'bls-nodownload',
  template: `
    <div class="page-container">
      <form *ngIf="!hideForm" #form="ngForm" (ngSubmit)="loadFile(form.value)">
        <div fxLayout="column" fxLayoutAlign="center" style="height: 100%;">
          <div fxLayout="row" fxLayoutAlign="center">
            <div fxLayout="column" fxLayoutAlign="center">
              <mat-form-field style="width:500px">
                <mat-select name="type" [(ngModel)]="type">
                  <mat-option value="profile">Profile</mat-option>
                  <mat-option value="character">Character</mat-option>
                </mat-select>
                <mat-label>Save File Type</mat-label>
              </mat-form-field>
              <mat-form-field>
                <mat-select name="platform" [(ngModel)]="platform">
                  <mat-option value="pc">PC</mat-option>
                  <mat-option value="ps4">PS4</mat-option>
                </mat-select>
                <mat-label>Platform</mat-label>
              </mat-form-field>
              <mat-form-field>
                <ngx-mat-file-input required name="file" [(ngModel)]="file"></ngx-mat-file-input>
                <mat-icon matSuffix>folder</mat-icon>
                <mat-label>File</mat-label>
              </mat-form-field>
              <button mat-raised-button [disabled]="form.invalid" type="submit">Load</button>
            </div>
          </div>
        </div>
      </form>
      <div *ngIf="hideForm">
        <mat-tab-group *ngIf="profile">
          <mat-tab label="Profile">
            <bls-profile-frame [load]="load" [save]="save"></bls-profile-frame>
          </mat-tab>
          <mat-tab label="Bank">
            <bls-bank-frame [load]="loadItems" [save]="save"></bls-bank-frame>
          </mat-tab>
        </mat-tab-group>
        <mat-tab-group *ngIf="character">
          <mat-tab label="Character">
            <bls-character-frame [load]="load" [save]="save"></bls-character-frame>
          </mat-tab>
          <mat-tab label="Items">
            <bls-items-frame [load]="loadItems" [save]="save"></bls-items-frame>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [
      `
      .page-container {
        height: calc(100vh - 64px)
      }

      form {
        height: 100%;
      }
    `,
  ],
})
export class NodownloadComponent implements OnInit {

  type = 'character';
  platform = 'pc';
  file: File;
  character: CharacterWrapper & { items: ItemRequest };
  profile: ProfileWrapper & { items: Item[] };
  hideForm: boolean;

  save: (data) => Observable<any>;
  load: () => Observable<any>;
  loadItems: () => Observable<any>;

  constructor(
    private wasm: WasmService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    if (!JSON.parse(localStorage.getItem('suppressMessage'))?.nodownload) {
      this.dialog.open(DeveloperMessageComponent, {
        data: {
          id: 'nodownload', content: [
            {
              text: `Welcome to browser mode.
        If you don't want to download the save editor, here is an browser only version.`,
            },
            {
              text: `This part of the editor is still very much experimental. If you have any feedback I'd love to hear it on discord.
As you might notice, you can also use this to edit PS4 saves.`,
            },
          ],
        },
      });
    }
  }

  public async loadFile(value: { type: 'character' | 'profile', platform: string, file: FileInput }) {
    console.log(value);
    const fileName = value.file.fileNames;
    const file = value.file.files[0];
    // @ts-ignore
    const data: Uint8Array = new Uint8Array(await file.arrayBuffer() as ArrayBuffer);
    console.log(data);
    if (value.type === 'character') {
      this.character = this.wasm.decodeCharacter(data, value.platform);
      console.log(this.character);
      this.profile = null;
      this.load = () => of({ char: this.character, id: -1 });
      this.loadItems = () => of({ items: this.character.items, id: -1 });
      this.save = d => {
        const updated = this.wasm.encodeCharacter(this.character, value.platform);
        saveAs(new Blob([updated], { type: 'application/octet-stream' }), fileName);
        return of(null);
      };
      this.hideForm = true;
    } else {
      this.profile = this.wasm.decodeProfile(data, value.platform);
      this.load = () => of(this.profile);
      this.loadItems = () => of(this.profile.items);
      this.save = d => {
        const updated = this.wasm.encodeProfile(this.profile, value.platform);
        saveAs(new Blob([updated], { type: 'application/octet-stream' }), fileName);
        return of(null);
      };
      this.character = null;
      this.hideForm = true;
    }
  }
}

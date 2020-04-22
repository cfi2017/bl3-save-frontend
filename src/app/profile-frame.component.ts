import { Component, OnInit, ViewChild } from '@angular/core';
import { ProxyService } from './proxy.service';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CUSTOMIZATIONS } from './const';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ConfigService } from './config.service';

@Component({
  selector: 'bls-profile-frame',
  template: `

    <div class="frame" *ngIf="data" style="min-height: 300px;">
      <div class="action-bar">
        <button mat-raised-button color="primary" (click)="save()">Save</button>
        <button mat-raised-button color="primary" (click)="unlockCustomizations()">Unlock all customizations</button>
      </div>
      <bls-profile-form [data]="data"></bls-profile-form>
      <json-editor *ngIf="config.advanced" style="height:100%;"
                   [data]="data" [options]="editorOptions"></json-editor>
    </div>
  `,
  styles: [
    `
    .frame {
      padding: 20px;
    }

    .action-bar {
      padding: 20px;
    }

    .action-bar button {
      margin-right: 10px;
    }
    `]
})
export class ProfileFrameComponent implements OnInit {

  data: any;
  editorOptions: JsonEditorOptions;

  constructor(
    private proxy: ProxyService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    public config: ConfigService
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'view';
    this.editorOptions.modes = [/*'code', 'text', 'tree', */'view'];
  }

  ngOnInit(): void {
    this.proxy.getProfile().subscribe(profile => this.data = profile);
  }

  save() {
    this.proxy.updateProfile(this.data)
      .subscribe(
        () => this.snackbar.open('Saved successfully.', 'Dismiss', {duration: 3000}),
        () => this.snackbar.open('Failed to save.', 'Dismiss', {duration: 3000}));
  }

  unlockCustomizations() {
    const unlocked = this.data.profile.unlocked_customizations.map(c => c.customization_asset_path);
    this.data.profile.unlocked_customizations.push(
      ...CUSTOMIZATIONS.filter(c => !unlocked.includes(c)).map(c => ({is_new: true, customization_asset_path: c}))
    );
  }

}

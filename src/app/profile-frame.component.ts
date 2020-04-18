import { Component, OnInit } from '@angular/core';
import { ProxyService } from './proxy.service';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CUSTOMIZATIONS } from './const';

@Component({
  selector: 'bls-profile-frame',
  template: `

    <div class="frame" *ngIf="data" style="min-height: 300px;">
      <div class="action-bar">
        <button mat-raised-button color="primary" (click)="save()">Save</button>
        <button mat-raised-button color="primary" (click)="unlockCustomizations()">Unlock all customizations</button>
      </div>
      <bls-profile-form [data]="data"></bls-profile-form>
      <pre *ngIf="debug">
      {{data | json}}
    </pre>
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
  debug = false;

  constructor(
    private proxy: ProxyService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.debug = !!localStorage.getItem('debug');
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

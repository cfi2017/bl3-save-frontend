import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeveloperMessageComponent } from './developer-message.component';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  get advanced(): boolean {
    return localStorage.getItem('advanced') === 'true';
  }

  set advanced(v: boolean) {
    if (!!v) {
      this.dialog.open(DeveloperMessageComponent, {
        data: `You've enabled the advanced editor.
        Things here are untested and are not guaranteed to work as expected. Use with caution.
        At the moment, only viewing is supported with the json editor.`
      });
    }
    localStorage.setItem('advanced', '' + v);
  }

  constructor(
    private dialog: MatDialog
  ) { }

}

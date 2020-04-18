import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProxyService } from './proxy.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { getExpForLevel, getLevelForExp } from './const';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'bls-character-frame',
  template: `
    <div class="frame" *ngIf="data" style="min-height: 300px;">
      <button mat-raised-button color="primary" (click)="save()">Save</button>
      <bls-character-form [data]="data"></bls-character-form>
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
    `
  ]
})
export class CharacterFrameComponent implements OnInit {

  @Input()
  data: any;

  debug = false;
  // tslint:disable-next-line:variable-name
  private _id: any;
  private id: any;

  constructor(
    private proxy: ProxyService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.debug = !!localStorage.getItem('debug');
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        tap(id => this._id = id),
        switchMap(id => this.proxy.getCharacter(id)),
      )
      .subscribe(char => {
        this.data = char;
        this.id = this._id;
        this.cdr.detectChanges();
      });

  }

  save() {
    this.proxy.updateCharacter(this.id, this.data)
      .subscribe(
        () => this.snackbar.open('Saved successfully.', 'Dismiss', {duration: 3000}),
        () => this.snackbar.open('Failed to save.', 'Dismiss', {duration: 3000}));
  }

}

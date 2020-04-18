import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProxyService } from './proxy.service';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { getExpForLevel, getLevelForExp } from './const';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'bls-character-frame',
  template: `
    <div class="frame" *ngIf="data" style="min-height: 300px;">
      <button mat-raised-button color="primary" (click)="save()">Save</button>
      <bls-character-form [data]="data"></bls-character-form>
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

  constructor(
    private proxy: ProxyService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.proxy.getCharacter(id)),
      )
      .subscribe(char => {
        this.data = char;
        this.cdr.detectChanges();
      });

  }

  save() {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.proxy.updateCharacter(id, this.data)),
      )
      .subscribe(
        () => this.snackbar.open('Saved successfully.', 'Dismiss', {duration: 3000}),
        () => this.snackbar.open('Failed to save.', 'Dismiss', {duration: 3000}));
  }

}

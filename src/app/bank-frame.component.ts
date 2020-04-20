import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProxyService } from './proxy.service';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Item, ItemRequest } from './model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTable } from '@angular/material/table';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ItemImportComponent } from './form/item-import.component';
import { environment } from '../environments/environment';
import compareVersions from 'compare-versions';

@Component({
  selector: 'bls-bank-frame',
  template: `
    <div style="min-height: 300px;">
      <mat-toolbar *ngIf="outOfDate" color="warn">
        Your proxy version ({{version}}) is out of date. You need at least version {{minimumVersion}} to edit bank items.
      </mat-toolbar>
      <ng-container *ngIf="!outOfDate">
        <div class="action-bar">
          <button mat-raised-button color="primary" (click)="save()">Save</button>
          <button mat-raised-button color="primary" (click)="openImportDialog()">Import Item</button>
        </div>
        <table mat-table [dataSource]="items" multiTemplateDataRows>
          <ng-container matColumnDef="level">
            <th mat-header-cell *matHeaderCellDef>Level</th>
            <td mat-cell *matCellDef="let element">{{element.level}}</td>
          </ng-container>

          <ng-container matColumnDef="balance">
            <th mat-header-cell *matHeaderCellDef>Balance</th>
            <td mat-cell *matCellDef="let element">{{element.balance | asset:'.'}}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button matTooltip="Duplicate" (click)="$event.preventDefault();duplicate(element)">
                <mat-icon>file_copy</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Delete" color="warn" (click)="$event.preventDefault();promptDelete(element)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="expandedDetail">
            <td mat-cell *matCellDef="let element" [attr.colspan]="displayedColumns.length">
              <div
                class="item-detail"
                *ngIf="element === expandedElement"
                [@detailExpand]="element === expandedElement ? 'expanded' : 'collapsed'">
                <bls-item-form [data]="element"></bls-item-form>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let element; columns: displayedColumns;"
              class="element-row"
              [class.expanded-row]="expandedElement === element"
              (click)="expandedElement = expandedElement === element ? null : element"
          ></tr>
          <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="detail-row"></tr>
        </table>
      </ng-container>
    </div>
  `,
  styleUrls: [
    'items-frame.component.scss',
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class BankFrameComponent implements OnInit {

  items: Item[] = [];
  displayedColumns = [
    'level', 'balance', 'actions'
  ];
  expandedElement: Item;
  version: string;
  outOfDate = false;
  minimumVersion: string;

  @ViewChild(MatTable)
  table: MatTable<any>;
  // tslint:disable-next-line:variable-name
  private _id: any;
  private id: any;

  constructor(
    private route: ActivatedRoute,
    private proxy: ProxyService,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.proxy.getBankItems()
      .subscribe(items => {
        this.id = this._id; // only change id on full load
        this.items = items;
        this.cdr.detectChanges();
      });
    this.proxy.getStatus().subscribe(status => {
      this.version = status.buildVersion;
      this.checkVersion();
    });
  }

  private checkVersion() {
    this.minimumVersion = 'v1.0.5';
    if (!this.version) {
      this.outOfDate = true;
      this.version = '<= 1.0.3';
      return;
    }
    this.outOfDate = compareVersions(this.version, this.minimumVersion) === -1;
  }
  public save() {
    this.proxy.updateBankItems(this.items).subscribe(
      () => this.snackbar.open('Saved successfully.', 'Dismiss', {duration: 3000}),
      () => this.snackbar.open('Failed to save.', 'Dismiss', {duration: 3000}));
  }

  public duplicate(element: Item) {
    const copyOfItem: Item = {
      generics: element.generics ? [...element.generics] : null,
      parts: element.parts ? [...element.parts] : null,
      level: element.level,
      version: element.version,
      overflow: element.overflow,
      inv_data: element.inv_data,
      balance: element.balance,
      manufacturer: element.manufacturer,
      wrapper: {
        ...element.wrapper
      }
    };
    const index = this.items.indexOf(element);
    this.items.push(copyOfItem);
    moveItemInArray(this.items, this.items.length - 1, index + 1);
    this.table.renderRows();
  }

  public promptDelete(element: Item) {
    const index = this.items.indexOf(element);
    this.items.splice(index, 1);
    this.table.renderRows();
  }

  public openImportDialog() {
    this.dialog.open(ItemImportComponent, {
      width: '80%'
    }).afterClosed()
      .pipe(
        filter(r => !!r),
        switchMap(code => this.proxy.convert(code))
      ).subscribe(result => {
      this.items.push(result);
      moveItemInArray(this.items, this.items.length - 1, 0);
      this.table.renderRows();
    });
  }

}

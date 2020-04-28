import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProxyService } from './proxy.service';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Item, ItemRequest } from './model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTable } from '@angular/material/table';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ItemImportComponent } from './form/item-import.component';
import { ItemExportComponent } from './form/item-export.component';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { ConfigService } from './config.service';
import { MassItemLevelDialogComponent } from './mass-item-level-dialog.component';
import { BalancePickerComponent } from './form/balance-picker.component';
import { BALANCE_BLACKLIST, bestGuessManufacturer } from './const';
import { AssetService } from './asset.service';

@Component({
  selector: 'bls-items-frame',
  template: `
    <div style="min-height: 300px;">
      <div class="action-bar">
        <button mat-raised-button color="primary" (click)="save()">Save</button>
        <button mat-raised-button color="primary" (click)="openImportDialog()">Import Item</button>
        <button mat-raised-button color="primary" (click)="openNewItemDialog()">Create Item</button>
        <button mat-raised-button color="primary" (click)="openLevelChangeDialog()">Change Level of all Items</button>
      </div>
      <table mat-table [dataSource]="itemRequest?.items" multiTemplateDataRows>
        <ng-container matColumnDef="level">
          <th mat-header-cell *matHeaderCellDef>Level</th>
          <td mat-cell *matCellDef="let element">{{element.level}}</td>
        </ng-container>

        <ng-container matColumnDef="balance">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let element">{{element.balance | asset:'.' | name}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button matTooltip="Export" (click)="$event.preventDefault();export(element)">
              <mat-icon>share</mat-icon>
            </button>
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
export class ItemsFrameComponent implements OnInit {

  itemRequest: ItemRequest;
  displayedColumns = [
    'level', 'balance', 'actions'
  ];
  expandedElement: Item;

  @ViewChild(MatTable)
  table: MatTable<any>;
  // tslint:disable-next-line:variable-name
  private _id: any;
  private id: any;
  private editorOptions: JsonEditorOptions;

  constructor(
    private route: ActivatedRoute,
    private proxy: ProxyService,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private assets: AssetService
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        tap(id => this._id = id),
        switchMap(id => this.proxy.getItems(id)),
      )
      .subscribe(items => {
        this.id = this._id; // only change id on full load
        this.itemRequest = items;
        this.cdr.detectChanges();
      });
  }

  public save() {
    this.proxy.updateItems(this.id, this.itemRequest)
      .pipe(
        tap(
          () => this.snackbar.open('Saved successfully.', 'Dismiss', {duration: 3000}),
          () => this.snackbar.open('Failed to save.', 'Dismiss', {duration: 3000})
        )
      ).subscribe(() => this.loadData());
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
    const index = this.itemRequest.items.indexOf(element);
    this.itemRequest.items.push(copyOfItem);
    moveItemInArray(this.itemRequest.items, this.itemRequest.items.length - 1, index + 1);
    this.itemRequest.equipped.forEach(e => {
      if (e.inventory_list_index > index) {
        e.inventory_list_index++;
      }
    });
    this.table.renderRows();
  }

  public promptDelete(element: Item) {
    const index = this.itemRequest.items.indexOf(element);
    this.itemRequest.equipped.forEach(e => {
      if (e.inventory_list_index === index) {
        // special case, check what to do in this case (unequip?)
        e.inventory_list_index = -1;
      } else if (e.inventory_list_index > index) {
        e.inventory_list_index--;
      }
    });
    this.itemRequest.items.splice(index, 1);
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
        this.itemRequest.items.push(result);
        moveItemInArray(this.itemRequest.items, this.itemRequest.items.length - 1, 0);
        this.itemRequest.equipped.forEach(e => {
          e.inventory_list_index++;
        });
        this.table.renderRows();
      });
  }

  public openLevelChangeDialog() {
    this.dialog.open(MassItemLevelDialogComponent, {
      width: '80%'
    }).afterClosed().subscribe(l => {
      const mayhemTemplate = 'Part_WeaponMayhemLevel_';
      if (!!l) {
        this.itemRequest.items.forEach(i => {
          i.level = l.level;
          if (l.mayhemLevel > 10) l.mayhemLevel = 10;
          if (l.mayhemLevel < 0) l.mayhemLevel = 0;
          const mlString = `${l.mayhemLevel}`.padStart(2, '0');
          if (l.mayhem) {
            i.generics = i.generics || [];
            i.generics = i.generics.filter(p => !p.includes('Part_WeaponMayhemLevel'));
            if (i.generics.length < 15) {
              i.generics.push(
                `/Game/PatchDLC/Mayhem2/Gear/Weapon/_Shared/_Design/MayhemParts/${mayhemTemplate}${mlString}.${mayhemTemplate}${mlString}`);
            }
          }
        });
        this.table.renderRows();
      }
    });
  }

  public openNewItemDialog() {
    this.dialog.open(BalancePickerComponent, {
      width: '80%',
      data: {
        options: this.assets.getAssetsForKey('InventoryBalanceData'),
        blacklist: BALANCE_BLACKLIST
      }
    }).afterClosed()
      .pipe(
        filter(res => !!res),
      )
      .subscribe(res => this.createItem(res));
  }

  private createItem(balance: string) {
    const item: Item = {
      level: 57,
      balance,
      manufacturer: bestGuessManufacturer(balance, ''),
      inv_data: '',
      parts: [],
      generics: [],
      overflow: '',
      version: 55,
      wrapper: {
        item_serial_number: '',
        pickup_order_index: 255
      }
    };
    this.itemRequest.items.push(item);
    moveItemInArray(this.itemRequest.items, this.itemRequest.items.length - 1, 0);
    this.itemRequest.equipped.forEach(e => {
      e.inventory_list_index++;
    });
    this.table.renderRows();
  }


  public export(element: Item) {
    this.dialog.open(ItemExportComponent, {
      width: '80%',
      data: element
    });
  }
}

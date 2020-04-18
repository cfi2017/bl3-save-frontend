import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProxyService } from './proxy.service';
import { map, switchMap } from 'rxjs/operators';
import { Item } from './model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTable } from '@angular/material/table';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'bls-items-frame',
  template: `
    <div style="min-height: 300px;">
      <button mat-raised-button color="primary" (click)="save()">Save</button>
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

  items: Item[] = [];
  displayedColumns = [
    'level', 'balance', 'actions'
  ];
  expandedElement: Item;

  @ViewChild(MatTable)
  table: MatTable<any>;

  constructor(
    private route: ActivatedRoute,
    private proxy: ProxyService,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.proxy.getItems(id)),
      )
      .subscribe(items => this.items = items);
  }

  public save() {
    this.proxy.updateItems(this.route.snapshot.params.id, this.items).subscribe();
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
    moveItemInArray(this.items, this.items.indexOf(element), this.items.length - 1);
    this.items.pop();
    this.table.renderRows();
  }
}

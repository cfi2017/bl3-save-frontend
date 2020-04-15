import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProxyService } from './proxy.service';
import { map, switchMap } from 'rxjs/operators';
import { Item } from './model';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
    'level', 'balance',
  ];
  expandedElement: Item;

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
}

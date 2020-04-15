import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'bls-part-picker',
  template: `
    <mat-expansion-panel class="mat-elevation-z3">
      <mat-expansion-panel-header>
        <mat-panel-title>{{partTitle}} ({{pickedParts.length}} / {{max || 'unlimited'}})</mat-panel-title>
      </mat-expansion-panel-header>
      <div class="container">
        <div fxLayout="row" fxLayoutGap="5px">

          <div fxLayout="column" fxFlex="1 1">
            <mat-form-field>
              <input matInput #pickedFilter/>
              <mat-label>Filter</mat-label>
            </mat-form-field>
            <mat-list dense
                      cdkDropList
                      #picked="cdkDropList"
                      class="list"
                      (cdkDropListDropped)="drop($event)"
            >
              <mat-list-item
                class="box move"
                *ngFor="let part of pickedParts | filter:pickedFilter.value; let i = index"
                cdkDrag>
                <div style="width: 100%;" fxLayout="row" fxLayoutAlign="space-between">
                  <span>{{part | asset:'.'}}</span>
                  <button mat-icon-button color="warn" (click)="removePart(i)"><mat-icon>delete</mat-icon></button>
                </div>
              </mat-list-item>
            </mat-list>
          </div>
          <div fxLayout="column" fxFlex="1 1">
            <mat-form-field>
              <input matInput #availableFilter/>
              <mat-label>Filter</mat-label>
            </mat-form-field>
            <mat-list class="list" dense>
              <mat-list-item
                class="box"
                *ngFor="let part of availableParts | filter:availableFilter.value"
              >
                <div style="width: 100%;" fxLayout="row" fxLayoutAlign="space-between">
                  <span>{{part | asset:'.'}}</span>
                  <button mat-icon-button
                          color="primary"
                          [disabled]="max && pickedParts.length >= max"
                          (click)="addPart(part)"><mat-icon>add</mat-icon></button>
                </div>
              </mat-list-item>
            </mat-list>
          </div>

        </div>

      </div>
    </mat-expansion-panel>
  `,
  styles: [
      `
      .container {
        width: 600px;
        max-width: 100%;
        margin: 0 25px 25px 0;
        display: inline-block;
        vertical-align: top;
      }

      .list {
        border: solid 1px #ccc;
        min-height: 60px;
        background: white;
        border-radius: 4px;
        overflow: hidden;
        display: block;
      }

      .box {
        padding: 20px 10px;
        border-bottom: solid 1px #ccc;
        color: rgba(0, 0, 0, 0.87);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;

        background: white;
        font-size: 14px;
      }

      .box.move {
        cursor: move;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
        0 8px 10px 1px rgba(0, 0, 0, 0.14),
        0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-placeholder {
        opacity: 0;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .box:last-child {
        border: none;
      }

      .list.cdk-drop-list-dragging .box:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class PartPickerComponent implements OnInit {

  @Input()
  pickedParts: string[] = [];

  @Input()
  availableParts: string[] = [];

  @Input()
  partTitle = 'Parts';

  @Input()
  max: number;

  constructor(
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  public drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.pickedParts, event.previousIndex, event.currentIndex);
  }

  removePart(index: number) {
    this.pickedParts[index] = this.pickedParts[this.pickedParts.length - 1];
    this.pickedParts.pop();
  }

  addPart(part: string) {
    this.pickedParts.push(part);
  }
}

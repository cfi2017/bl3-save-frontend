import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProxyService } from './proxy.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { CharacterWrapper } from './model';
import { ConfigService } from './config.service';
import { VEHICLE_CHASSIS, VEHICLE_PARTS, VEHICLE_SKINS } from './const';

@Component({
  selector: 'bls-character-frame',
  template: `
    <div class="frame" *ngIf="data" style="min-height: 300px;">
      <div class="action-bar" fxLayout="row" fxLayoutGap="5px">
        <button mat-raised-button color="primary" (click)="save()">Save</button>
        <button mat-raised-button color="primary" (click)="unlockVehicleCustomizations()">Unlock Vehicle Customizations</button>
      </div>
      <bls-character-form [data]="data"></bls-character-form>
      <json-editor *ngIf="config.advanced" style="height:100%;" [data]="data" [options]="editorOptions"></json-editor>
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

      bls-character-form {
        margin-bottom: 10px;
      }
    `,
  ],
})
export class CharacterFrameComponent implements OnInit {

  @Input()
  data: CharacterWrapper;

  // tslint:disable-next-line:variable-name
  private _id: any;
  private id: any;

  editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, {static: true})
  editor: JsonEditorComponent;


  constructor(
    private proxy: ProxyService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    public config: ConfigService
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'view';
    this.editorOptions.modes = [/*'code', 'text', 'tree', */'view'];
  }

  ngOnInit(): void {
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
        () => this.snackbar.open('Saved successfully.', 'Dismiss', { duration: 3000 }),
        () => this.snackbar.open('Failed to save.', 'Dismiss', { duration: 3000 }),
      );
  }

  unlockVehicleCustomizations() {
    if (!this.data.character.vehicle_parts_unlocked) {
      this.data.character.vehicle_parts_unlocked = [];
    }
    if (!this.data.character.vehicles_unlocked_data) {
      this.data.character.vehicle_parts_unlocked = [];
    }
    const hasChassis = this.data.character.vehicles_unlocked_data.map(c => c.asset_path);
    this.data.character.vehicles_unlocked_data.push(
      ...VEHICLE_CHASSIS.filter(c => hasChassis.indexOf(c) === -1).map(c => ({asset_path: c, just_unlocked: true})));

    this.data.character.vehicle_parts_unlocked.push(
      ...VEHICLE_PARTS.filter(c => this.data.character.vehicle_parts_unlocked.indexOf(c) === -1),
      ...VEHICLE_SKINS.filter(c => this.data.character.vehicle_parts_unlocked.indexOf(c) === -1)
    );
  }
}

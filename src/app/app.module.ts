import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { FlexModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ExpToLevelPipe } from './const';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CharacterFrameComponent } from './character-frame.component';
import { ProfileFrameComponent } from './profile-frame.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { ItemsFrameComponent } from './items-frame.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DefaultComponent } from './default.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ItemFormComponent } from './form/item-form.component';
import { MatTableModule } from '@angular/material/table';
import { PartPickerComponent } from './form/part-picker.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FilterPipe } from './form/filter.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { AssetPipe } from './form/asset.pipe';
import { MatIconModule } from '@angular/material/icon';
import { ProfileFormComponent } from './form/profile-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CharacterFormComponent } from './form/character-form.component';
import { ItemImportComponent } from './form/item-import.component';

export const ROUTES: Routes = [
  {
    path: 'profile',
    component: ProfileFrameComponent
  },
  {
    path: 'character/:id/items',
    component: ItemsFrameComponent
  },
  {
    path: 'character/:id',
    component: CharacterFrameComponent
  },
  {
    path: '**',
    component: DefaultComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ExpToLevelPipe,
    CharacterFrameComponent,
    ProfileFrameComponent,
    ItemsFrameComponent,
    DefaultComponent,
    ItemFormComponent,
    PartPickerComponent,
    FilterPipe,
    AssetPipe,
    ProfileFormComponent,
    CharacterFormComponent,
    ItemImportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDividerModule,
    FlexModule,
    MatCardModule,
    MatListModule,
    MatOptionModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    RouterModule.forRoot(ROUTES),
    MatSidenavModule,
    MatExpansionModule,
    MatTableModule,
    DragDropModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

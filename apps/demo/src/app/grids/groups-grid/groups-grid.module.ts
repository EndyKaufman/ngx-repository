import { NgModule, ModuleWithProviders } from '@angular/core';
import { GroupsGridComponent } from './groups-grid.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GroupModalComponent } from './group-modal/group-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxRepositoryModules } from 'ngx-repository';
import { SharedModule } from '../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GroupsGridModalComponent } from './groups-grid-modal/groups-grid-modal.component';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    NgxRepositoryModules,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule
  ],
  entryComponents: [
    GroupsGridComponent,
    GroupModalComponent,
    GroupsGridModalComponent
  ],
  exports: [
    GroupsGridComponent,
    GroupModalComponent,
    GroupsGridModalComponent
  ],
  declarations: [
    GroupsGridComponent,
    GroupModalComponent,
    GroupsGridModalComponent
  ]
})
export class GroupsGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GroupsGridModule,
      providers: []
    };
  }
}

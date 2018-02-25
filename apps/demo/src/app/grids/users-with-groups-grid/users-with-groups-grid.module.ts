import { NgModule, ModuleWithProviders } from '@angular/core';
import { UsersWithGroupsGridComponent } from './users-with-groups-grid.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserWithGroupsModalComponent } from './user-with-groups-modal/user-with-groups-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxRepositoryModules } from 'ngx-repository';
import { SharedModule } from '../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GroupsGridModule } from '../groups-grid/groups-grid.module';
import { UserWithGroupsGroupsGridComponent } from './user-with-groups-modal/user-with-groups-groups-grid/user-with-groups-groups-grid.component';

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
    FlexLayoutModule,
    GroupsGridModule.forRoot()
  ],
  entryComponents: [
    UsersWithGroupsGridComponent,
    UserWithGroupsModalComponent,
    UserWithGroupsGroupsGridComponent
  ],
  exports: [
    UsersWithGroupsGridComponent,
    UserWithGroupsModalComponent,
    UserWithGroupsGroupsGridComponent
  ],
  declarations: [
    UsersWithGroupsGridComponent,
    UserWithGroupsModalComponent,
    UserWithGroupsGroupsGridComponent
  ]
})
export class UsersWithGroupsGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UsersWithGroupsGridModule,
      providers: []
    };
  }
}

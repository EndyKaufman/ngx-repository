import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxRepositoryModule } from 'ngx-repository';
import { SharedModule } from '../../shared/shared.module';
import { GroupsGridModule } from '../groups-grid/groups-grid.module';
import { UserWithGroupsGroupsGridComponent } from './user-with-groups-modal/user-with-groups-groups-grid/user-with-groups-groups-grid.component';
import { UserWithGroupsModalComponent } from './user-with-groups-modal/user-with-groups-modal.component';
import { UsersWithGroupsGridComponent } from './users-with-groups-grid.component';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    NgxRepositoryModule,
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
  entryComponents: [UsersWithGroupsGridComponent, UserWithGroupsModalComponent, UserWithGroupsGroupsGridComponent],
  exports: [UsersWithGroupsGridComponent, UserWithGroupsModalComponent, UserWithGroupsGroupsGridComponent],
  declarations: [UsersWithGroupsGridComponent, UserWithGroupsModalComponent, UserWithGroupsGroupsGridComponent]
})
export class UsersWithGroupsGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UsersWithGroupsGridModule,
      providers: []
    };
  }
}

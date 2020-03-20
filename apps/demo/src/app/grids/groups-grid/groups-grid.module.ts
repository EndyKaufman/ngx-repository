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
import { GroupModalComponent } from './group-modal/group-modal.component';
import { GroupsGridModalComponent } from './groups-grid-modal/groups-grid-modal.component';
import { GroupsGridComponent } from './groups-grid.component';

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
    FlexLayoutModule
  ],
  entryComponents: [GroupsGridComponent, GroupModalComponent, GroupsGridModalComponent],
  exports: [GroupsGridComponent, GroupModalComponent, GroupsGridModalComponent],
  declarations: [GroupsGridComponent, GroupModalComponent, GroupsGridModalComponent]
})
export class GroupsGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GroupsGridModule,
      providers: []
    };
  }
}

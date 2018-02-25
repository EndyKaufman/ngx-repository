import { NgModule, ModuleWithProviders } from '@angular/core';
import { UsersGridComponent } from './users-grid.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserModalComponent } from './user-modal/user-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxRepositoryModules } from 'ngx-repository';
import { SharedModule } from '../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MessageBoxModule } from '../../others/message-box/message-box.module';

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
    MessageBoxModule.forRoot()
  ],
  entryComponents: [
    UsersGridComponent,
    UserModalComponent
  ],
  exports: [
    UsersGridComponent,
    UserModalComponent
  ],
  declarations: [
    UsersGridComponent,
    UserModalComponent
  ]
})
export class UsersGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UsersGridModule,
      providers: []
    };
  }
}

import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxRepositoryModule } from 'ngx-repository';
import { MessageBoxModule } from '../../others/message-box/message-box.module';
import { SharedModule } from '../../shared/shared.module';
import { UserModalComponent } from './user-modal/user-modal.component';
import { UsersGridComponent } from './users-grid.component';

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
    MessageBoxModule.forRoot()
  ],
  entryComponents: [UsersGridComponent, UserModalComponent],
  exports: [UsersGridComponent, UserModalComponent],
  declarations: [UsersGridComponent, UserModalComponent]
})
export class UsersGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UsersGridModule,
      providers: []
    };
  }
}

import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectorRef } from '@angular/core';
import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from '../../../shared/models/user';
import { IModel } from 'ngx-repository';

@Component({
  selector: 'user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {

  @Input()
  form: DynamicFormGroup<User>;
  @Input()
  hideOnNo = true;
  @Input()
  hideOnYes = false;
  @Input()
  strings = User.strings;
  @Input()
  title: string;
  @Input()
  message: string;
  @Input()
  noTitle = 'Cancel';
  @Input()
  yesTitle = 'OK';
  @Output()
  no = new EventEmitter<UserModalComponent>();
  @Output()
  yes = new EventEmitter<UserModalComponent>();

  fb = new DynamicFormBuilder();

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    public changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    if (this.data !== undefined) {
      this.form = this.fb.group(User, {
        id: null,
        username: '',
        email: '',
        dateOfBirth: undefined,
        isSuperuser: false,
        isStaff: false,
        isActive: false
      });
      this.form.object = this.data;
      this.form.validateAllFormFields();
    }
  }
  ngOnInit() {
    this.changeDetectorRef.detectChanges();
  }
  onYesClick(): void {
    if (this.data) {
      if (this.form.valid) {
        this.data = this.form.object;
        this.yes.emit(this);
      } else {
        this.form.validateAllFormFields();
      }
    } else {
      this.yes.emit(this);
    }
    if (this.hideOnYes) {
      this.dialogRef.close();
    }
  }
  onNoClick(): void {
    this.no.emit(this);
    if (this.hideOnNo) {
      this.dialogRef.close();
    }
  }
}
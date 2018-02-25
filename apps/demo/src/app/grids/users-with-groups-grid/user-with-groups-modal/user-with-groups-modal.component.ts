import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserWithGroups } from '../../../shared/models/user-with-groups';
import { IModel } from 'ngx-repository';
import { GROUPS_MOCKS } from '../../../shared/mocks/groups.mock';
import { Group } from '../../../shared/models/group';
import { UserWithGroupsGroupsGridComponent } from './user-with-groups-groups-grid/user-with-groups-groups-grid.component';

@Component({
  selector: 'user-with-groups-modal',
  templateUrl: './user-with-groups-modal.component.html',
  styleUrls: ['./user-with-groups-modal.component.scss']
})
export class UserWithGroupsModalComponent implements OnInit {

  @ViewChild('groupsGrid')
  groupsGrid: UserWithGroupsGroupsGridComponent;
  // todo: used only as sample, you must remove it on you project
  @Input()
  exampleGroupMockedItems?: Group[];
  @Input()
  exampleUseNestedGroupsFromRest?: boolean;

  @Input()
  form: DynamicFormGroup<UserWithGroups>;
  @Input()
  hideOnNo = true;
  @Input()
  hideOnYes = false;
  @Input()
  strings = UserWithGroups.strings;
  @Input()
  title: string;
  @Input()
  message: string;
  @Input()
  noTitle = 'Cancel';
  @Input()
  yesTitle = 'OK';
  @Output()
  no = new EventEmitter<UserWithGroupsModalComponent>();
  @Output()
  yes = new EventEmitter<UserWithGroupsModalComponent>();

  fb = new DynamicFormBuilder();

  get item() {
    return this.form.object;
  }
  set item(item: UserWithGroups) {
    this.form.object = item;
  }
  constructor(
    public dialogRef: MatDialogRef<UserWithGroupsModalComponent>,
    public changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    if (this.data !== undefined) {
      this.form = this.fb.group(UserWithGroups, {
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

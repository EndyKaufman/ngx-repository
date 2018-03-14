import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectorRef } from '@angular/core';
import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Group } from '../../../shared/models/group';

@Component({
  selector: 'group-modal',
  templateUrl: './group-modal.component.html',
  styleUrls: ['./group-modal.component.scss']
})
export class GroupModalComponent implements OnInit {

  @Input()
  form: DynamicFormGroup<Group>;
  @Input()
  hideOnNo = true;
  @Input()
  hideOnYes = false;
  @Input()
  strings = Group.strings;
  @Input()
  title: string;
  @Input()
  message: string;
  @Input()
  noTitle = 'Cancel';
  @Input()
  yesTitle = 'OK';
  @Output()
  no = new EventEmitter<GroupModalComponent>();
  @Output()
  yes = new EventEmitter<GroupModalComponent>();

  fb = new DynamicFormBuilder();

  constructor(
    public dialogRef: MatDialogRef<GroupModalComponent>,
    public changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    if (this.data !== undefined) {
      this.form = this.fb.group(Group, {
        id: null,
        name: '',
        title: ''
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

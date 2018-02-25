import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DynamicFormGroup, DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Group } from '../../../shared/models/group';
import { IModel } from 'ngx-repository';
import { GroupsGridComponent } from '../groups-grid.component';

@Component({
  selector: 'groups-grid-modal',
  templateUrl: './groups-grid-modal.component.html',
  styleUrls: ['./groups-grid-modal.component.scss']
})
export class GroupsGridModalComponent implements OnInit {

  @ViewChild('groupsGrid')
  groupsGrid: GroupsGridComponent;

  @Input()
  mockedItems?: Group[];

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
  yesTitle = 'Select';
  @Output()
  no = new EventEmitter<GroupsGridModalComponent>();
  @Output()
  yes = new EventEmitter<GroupsGridModalComponent>();

  fb = new DynamicFormBuilder();

  constructor(
    public dialogRef: MatDialogRef<GroupsGridModalComponent>,
    public changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }
  ngOnInit() {
    this.changeDetectorRef.detectChanges();
  }
  onYesClick(): void {
    this.data = this.groupsGrid.selection.selected;
    this.yes.emit(this);
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

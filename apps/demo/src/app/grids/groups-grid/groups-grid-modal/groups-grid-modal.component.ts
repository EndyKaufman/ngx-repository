import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFormBuilder } from 'ngx-dynamic-form-builder';
import { Group } from '../../../shared/models/group';
import { GroupsGridComponent } from '../groups-grid.component';

@Component({
  selector: 'groups-grid-modal',
  templateUrl: './groups-grid-modal.component.html',
  styleUrls: ['./groups-grid-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  ) {}
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

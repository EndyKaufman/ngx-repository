import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { DynamicRepository, ProviderActionEnum, Repository } from 'ngx-repository';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { MessageBoxService } from '../../../../others/message-box/message-box.service';
import { Group } from '../../../../shared/models/group';
import { UserWithGroups } from '../../../../shared/models/user-with-groups';
import { GroupModalComponent } from '../../../groups-grid/group-modal/group-modal.component';
import { GroupsGridModalComponent } from '../../../groups-grid/groups-grid-modal/groups-grid-modal.component';

@Component({
  selector: 'user-with-groups-groups-grid',
  templateUrl: './user-with-groups-groups-grid.component.html',
  styleUrls: ['./user-with-groups-groups-grid.component.scss'],
  entryComponents: [GroupModalComponent, GroupsGridModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserWithGroupsGroupsGridComponent implements OnInit, OnDestroy {
  @Input()
  user: UserWithGroups;
  @Output()
  userChange: EventEmitter<UserWithGroups> = new EventEmitter<UserWithGroups>();

  // todo: used only as sample, you must remove it on you project
  @Input()
  exampleGroupMockedItems?: Group[];
  @Input()
  exampleUseNestedGroupsFromRest?: boolean;

  @Input()
  mockedItems?: Group[];

  displayedColumns = ['title', 'action'];

  strings = Group.strings;

  dataSource = new MatTableDataSource<Group>();
  pageEvent: PageEvent;
  repository: Repository<Group>;

  private destroyed$: Subject<boolean>;

  constructor(
    public dialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    private dynamicRepository: DynamicRepository,
    private messageBoxService: MessageBoxService
  ) {
    this.destroyed$ = new Subject<boolean>();
    this.repository = this.dynamicRepository.fork<Group>(Group);
  }
  ngOnInit() {
    if (this.mockedItems === undefined) {
      this.repository.useRest({
        apiUrl: environment.apiUrl + '/users/' + this.user.id,
        pluralName: 'groups',
        paginationMeta: {
          curPage: 1,
          perPage: 10000
        },
        autoload: !!this.user.id,
        globalEventResolver: (data: any, action: ProviderActionEnum) => {
          return action !== ProviderActionEnum.Create && action !== ProviderActionEnum.Delete;
        }
      });
    }

    if (this.mockedItems !== undefined) {
      this.repository.useMock({
        items: this.mockedItems,
        paginationMeta: {
          curPage: 1,
          perPage: 10000
        },
        globalEventResolver: (data: any, action: ProviderActionEnum) => {
          return action !== ProviderActionEnum.Create && action !== ProviderActionEnum.Delete;
        }
      });
    }

    this.repository.items$.pipe(takeUntil(this.destroyed$)).subscribe(items => {
      this.dataSource.data = items;
    });
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  showRemoveModal(item: Group): void {
    const dialogRef = this.dialog.open(GroupModalComponent, {
      width: '400px',
      data: null
    });
    dialogRef.componentInstance.title = this.strings.deleteFromUserTitle.replace('{data.title}', item.title.toString());
    dialogRef.componentInstance.message = this.strings.deleteFromUserMessage.replace(
      '{data.title}',
      item.title.toString()
    );
    dialogRef.componentInstance.yes.subscribe((modal: GroupModalComponent) =>
      this.repository.delete(item.id, { globalEventIsActive: false }).subscribe(
        modalItem => {
          const filtred = this.user.groups.filter(eachItem => eachItem.id !== modalItem.id);
          this.user.groups = filtred;
          this.userChange.emit(this.user);
          dialogRef.close();
        },
        error => this.messageBoxService.error(error).subscribe()
      )
    );
  }
  showAppendModal(): void {
    if (this.exampleUseNestedGroupsFromRest && this.user.id === undefined) {
      this.messageBoxService.error('Before add group you must save current user!').subscribe();
      return;
    }
    const dialogRef = this.dialog.open(GroupsGridModalComponent, {
      width: '600px',
      data: {}
    });
    dialogRef.componentInstance.title = this.strings.appendToUserTitle;
    dialogRef.componentInstance.yesTitle = 'Append';
    dialogRef.componentInstance.mockedItems = this.exampleGroupMockedItems;
    dialogRef.componentInstance.yes.subscribe((modal: GroupsGridModalComponent) => {
      const observables = [];
      (modal.data as Group[]).forEach(group => {
        const foundedGroup = this.user.groups.find(item => item.id === group.id);
        if (!foundedGroup) {
          observables.push(this.repository.create(group, { globalEventIsActive: false }));
        }
      });
      if (observables.length) {
        forkJoin(...observables).subscribe((modalItems: Group[]) => {
          modalItems.forEach(modalItem => this.user.groups.unshift(modalItem));
          this.userChange.emit(this.user);
          dialogRef.close();
        });
      } else {
        dialogRef.close();
      }
    });
  }
}

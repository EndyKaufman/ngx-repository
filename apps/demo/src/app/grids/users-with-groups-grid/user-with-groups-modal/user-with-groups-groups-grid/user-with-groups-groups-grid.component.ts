import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatDialog } from '@angular/material';
import { Repository, PaginationMeta, DynamicRepository } from 'ngx-repository';
import { Subject } from 'rxjs/Subject';
import { takeUntil, debounceTime, distinctUntilChanged, map, switchMap, concat, catchError } from 'rxjs/operators';
import { RestProvider } from 'ngx-repository';
import { plainToClass } from 'class-transformer';
import { FormControl } from '@angular/forms';
import { GroupModalComponent } from '../../../groups-grid/group-modal/group-modal.component';
import { Group } from '../../../../shared/models/group';
import { environment } from '../../../../../environments/environment';
import { GroupsGridModalComponent } from '../../../groups-grid/groups-grid-modal/groups-grid-modal.component';
import { UserWithGroups } from '../../../../shared/models/user-with-groups';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Component({
  selector: 'user-with-groups-groups-grid',
  templateUrl: './user-with-groups-groups-grid.component.html',
  styleUrls: ['./user-with-groups-groups-grid.component.scss'],
  entryComponents: [
    GroupModalComponent, GroupsGridModalComponent
  ]
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
    public dynamicRepository: DynamicRepository
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
        }
      });
    }

    if (this.mockedItems !== undefined) {
      this.repository.useMock({
        items: this.mockedItems,
        paginationMeta: {
          curPage: 1,
          perPage: 10000
        }
      });
    }

    this.repository.provider.items$.
      pipe(takeUntil(this.destroyed$)).
      subscribe(items => {
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
    dialogRef.componentInstance.title = this.strings.deleteFromUserTitle.
      replace('{data.title}', item.title.toString());
    dialogRef.componentInstance.message = this.strings.deleteFromUserMessage.
      replace('{data.title}', item.title.toString());
    dialogRef.componentInstance.yes.subscribe(async (modal: GroupModalComponent) => {
      try {
        const modalItem = await this.repository.provider.delete(item.id);
        const filtred = this.user.groups.filter(eachItem => eachItem.id !== modalItem.id);
        this.user.groups = filtred;
        this.userChange.emit(this.user);
      } catch (error) {
        throw error;
      }
      dialogRef.close();
    });
  }
  showAppendModal(): void {
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
          observables.push(fromPromise(this.repository.provider.create(group)));
        }
      });
      if (observables.length) {
        forkJoin(
          ...observables
        ).subscribe((modalItems: Group[]) => {
          modalItems.forEach(modalItem =>
            this.user.groups.unshift(modalItem)
          );
          this.userChange.emit(this.user);
          dialogRef.close();
        });
      } else {
        dialogRef.close();
      }
    });
  }
}

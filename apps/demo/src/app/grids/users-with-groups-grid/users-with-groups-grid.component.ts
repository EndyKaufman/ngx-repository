import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { UserWithGroupsModalComponent } from './user-with-groups-modal/user-with-groups-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { UserWithGroups } from '../../shared/models/user-with-groups';
import { PageEvent, MatDialog } from '@angular/material';
import { Repository, PaginationMeta, DynamicRepository } from 'ngx-repository';
import { Subject } from 'rxjs/Subject';
import { takeUntil, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { RestProvider } from 'ngx-repository';
import { environment } from '../../../environments/environment';
import { plainToClass } from 'class-transformer';
import { FormControl } from '@angular/forms';
import { Group } from '../../shared/models/group';

@Component({
  selector: 'users-with-groups-grid',
  templateUrl: './users-with-groups-grid.component.html',
  styleUrls: ['./users-with-groups-grid.component.scss'],
  entryComponents: [
    UserWithGroupsModalComponent
  ]
})
export class UsersWithGroupsGridComponent implements OnInit, OnDestroy {

  @Input()
  mockedItems?: UserWithGroups[];

  // todo: used only as sample, you must remove it on you project
  @Input()
  exampleGroupMockedItems?: Group[];
  @Input()
  exampleUseNestedGroupsFromRest?: boolean;

  searchField: FormControl;

  displayedColumns = ['id', 'username', 'email', 'dateOfBirth', 'roles', 'groups', 'action'];

  strings = UserWithGroups.strings;

  dataSource = new MatTableDataSource<UserWithGroups>();
  pageEvent: PageEvent;
  repository: Repository<UserWithGroups>;

  private destroyed$: Subject<boolean>;

  setPageEvent(event: PageEvent) {
    this.repository.setOptions({
      paginationMeta: {
        curPage: event.pageIndex + 1,
        perPage: event.pageSize
      }
    });
  }
  constructor(
    public dialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    public dynamicRepository: DynamicRepository
  ) {
    this.destroyed$ = new Subject<boolean>();
    this.repository = this.dynamicRepository.fork<UserWithGroups>(UserWithGroups);
  }
  ngOnInit() {
    this.searchField = new FormControl();

    this.searchField.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => this.repository.provider.loadAll({ searchText: value }))
    ).subscribe(value => console.log(value));

    if (this.mockedItems === undefined) {
      this.repository.useRest({
        apiUrl: environment.apiUrl,
        pluralName: 'users',
        paginationMeta: {
          perPage: 5
        }
      });
    }

    if (this.mockedItems !== undefined) {
      this.repository.useMock({
        items: this.mockedItems,
        paginationMeta: {
          perPage: 5
        }
      });
    }

    this.repository.provider.items$.
      pipe(takeUntil(this.destroyed$)).
      subscribe(items => {
        this.dataSource.data = items;
      });

    this.repository.paginationMeta$.
      pipe(takeUntil(this.destroyed$)).
      subscribe(paginationMeta => {
        const prevPageEvent = this.pageEvent;
        this.pageEvent = plainToClass(PageEvent, paginationMeta ? {
          pageIndex: paginationMeta.curPage - 1,
          pageSize: paginationMeta.perPage,
          length: paginationMeta.totalResults,
        } : {});
      });
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  showModal(item?: UserWithGroups): void {
    if (item === undefined) {
      item = new UserWithGroups();
    }
    const dialogRef = this.dialog.open(UserWithGroupsModalComponent, {
      width: '800px',
      data: item
    });
    dialogRef.componentInstance.title = (item.id && !isNaN(+item.id) ? this.strings.updateTitle : this.strings.createTitle).
      replace('{data.id}', item.id ? item.id.toString() : '');
    dialogRef.componentInstance.exampleGroupMockedItems = this.exampleGroupMockedItems;
    dialogRef.componentInstance.exampleUseNestedGroupsFromRest = this.exampleUseNestedGroupsFromRest;
    dialogRef.componentInstance.yes.subscribe(async (modal: UserWithGroupsModalComponent) => {
      if (modal.data !== undefined) {
        try {
          const modalItem = await this.repository.provider.save(modal.data);
        } catch (error) {
          throw error;
        }
        dialogRef.close();
      }
    });
  }
  showRemoveModal(item: UserWithGroups): void {
    const dialogRef = this.dialog.open(UserWithGroupsModalComponent, {
      width: '300px',
      data: null
    });
    dialogRef.componentInstance.title = this.strings.deleteTitle.
      replace('{data.id}', item.id.toString());
    dialogRef.componentInstance.message = this.strings.deleteMessage.
      replace('{data.id}', item.id.toString());
    dialogRef.componentInstance.exampleGroupMockedItems = this.exampleGroupMockedItems;
    dialogRef.componentInstance.exampleUseNestedGroupsFromRest = this.exampleUseNestedGroupsFromRest;
    dialogRef.componentInstance.yes.subscribe(async (modal: UserWithGroupsModalComponent) => {
      try {
        const modalItem = await this.repository.provider.delete(item.id);
      } catch (error) {
        throw error;
      }
      dialogRef.close();
    });
  }
}

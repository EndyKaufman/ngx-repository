import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { plainToClass } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ShortValidationErrors } from 'ngx-dynamic-form-builder';
import { DynamicRepository, Repository, ValidatorError } from 'ngx-repository';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MessageBoxService } from '../../others/message-box/message-box.service';
import { Group } from '../../shared/models/group';
import { UserWithGroups } from '../../shared/models/user-with-groups';
import { UserWithGroupsModalComponent } from './user-with-groups-modal/user-with-groups-modal.component';

@Component({
  selector: 'users-with-groups-grid',
  templateUrl: './users-with-groups-grid.component.html',
  styleUrls: ['./users-with-groups-grid.component.scss'],
  entryComponents: [UserWithGroupsModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersWithGroupsGridComponent implements OnInit, OnDestroy {
  @Input()
  mockedItems?: Partial<UserWithGroups>[];

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
    private dynamicRepository: DynamicRepository,
    private messageBoxService: MessageBoxService
  ) {
    this.destroyed$ = new Subject<boolean>();
    this.repository = this.dynamicRepository.fork<UserWithGroups>(UserWithGroups);
  }
  ngOnInit() {
    this.searchField = new FormControl();

    this.searchField.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(value => this.repository.loadAll({ searchText: value, curPage: 1 }))
      )
      .subscribe();

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

    this.repository.items$.pipe(takeUntil(this.destroyed$)).subscribe(items => {
      this.dataSource.data = items;
    });

    this.repository.paginationMeta$.pipe(takeUntil(this.destroyed$)).subscribe(paginationMeta => {
      this.pageEvent = plainToClass(
        PageEvent,
        paginationMeta
          ? {
              pageIndex: paginationMeta.curPage - 1,
              pageSize: paginationMeta.perPage,
              length: paginationMeta.totalResults
            }
          : {}
      );
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
    dialogRef.componentInstance.title = (item.id && !isNaN(+item.id)
      ? this.strings.updateTitle
      : this.strings.createTitle
    ).replace('{data.id}', item.id ? item.id.toString() : '');
    dialogRef.componentInstance.exampleGroupMockedItems = this.exampleGroupMockedItems;
    dialogRef.componentInstance.exampleUseNestedGroupsFromRest = this.exampleUseNestedGroupsFromRest;
    if (this.exampleUseNestedGroupsFromRest) {
      dialogRef.componentInstance.altYes.subscribe((modal: UserWithGroupsModalComponent) =>
        this.repository.save(modal.data, { useFakeHttpClient: true }).subscribe()
      );
    }
    dialogRef.componentInstance.yes.subscribe((modal: UserWithGroupsModalComponent) =>
      this.repository.save(modal.data).subscribe(
        modalItem => {
          if (modal.data !== undefined) {
            dialogRef.close();
          }
        },
        error => {
          if (error instanceof ValidatorError) {
            const externalErrors: ShortValidationErrors = {};
            (error.errors as ValidationError[]).map(err => {
              Object.keys(err.constraints).forEach(cons => {
                externalErrors[cons] = ['custom error:' + err.constraints[cons]];
              });
              return err;
            });
            modal.form.validate(externalErrors);
            modal.form.validateAllFormFields();
          } else {
            this.messageBoxService.error(error).then();
          }
        }
      )
    );
  }
  showRemoveModal(item: UserWithGroups): void {
    const dialogRef = this.dialog.open(UserWithGroupsModalComponent, {
      width: '300px',
      data: null
    });
    dialogRef.componentInstance.title = this.strings.deleteTitle.replace('{data.id}', item.id.toString());
    dialogRef.componentInstance.message = this.strings.deleteMessage.replace('{data.id}', item.id.toString());
    dialogRef.componentInstance.exampleGroupMockedItems = this.exampleGroupMockedItems;
    dialogRef.componentInstance.exampleUseNestedGroupsFromRest = this.exampleUseNestedGroupsFromRest;
    dialogRef.componentInstance.yes.subscribe((modal: UserWithGroupsModalComponent) =>
      this.repository.delete(item.id).subscribe(
        modalItem => {
          dialogRef.close();
        },
        error => this.messageBoxService.error(error).then()
      )
    );
  }
}

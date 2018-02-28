import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { UserModalComponent } from './user-modal/user-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../shared/models/user';
import { PageEvent, MatDialog } from '@angular/material';
import { Repository, PaginationMeta, DynamicRepository } from 'ngx-repository';
import { Subject } from 'rxjs/Subject';
import { takeUntil, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { RestProvider } from 'ngx-repository';
import { environment } from '../../../environments/environment';
import { plainToClass } from 'class-transformer';
import { FormControl } from '@angular/forms';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { ViewContainerRef } from '@angular/core';
import { MessageBoxService } from '../../others/message-box/message-box.service';

@Component({
  selector: 'users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.scss'],
  entryComponents: [
    UserModalComponent
  ]
})
export class UsersGridComponent implements OnInit, OnDestroy {

  @ViewChild('table')
  usersGrid: UsersGridComponent;

  @Input()
  mockedItems?: User[];

  searchField: FormControl;

  displayedColumns = ['id', 'username', 'email', 'dateOfBirth', 'roles', 'action'];

  strings = User.strings;

  dataSource = new MatTableDataSource<User>();
  pageEvent: PageEvent;
  repository: Repository<User>;

  customActionRequest: any;
  errorActionRequest: any;
  customActionResponse: any;
  errorActionResponse: any;

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
    public viewContainerRef: ViewContainerRef,
    public dynamicRepository: DynamicRepository,
    public messageBoxService: MessageBoxService
  ) {
    this.destroyed$ = new Subject<boolean>();
    this.repository = this.dynamicRepository.fork<User>(User);
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
  showModal(item?: User): void {
    if (item === undefined) {
      item = new User();
    }
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '400px',
      data: item
    });
    dialogRef.componentInstance.title = (item.id && !isNaN(+item.id) ? this.strings.updateTitle : this.strings.createTitle).
      replace('{data.id}', item.id ? item.id.toString() : '');
    dialogRef.componentInstance.yes.subscribe(async (modal: UserModalComponent) => {
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
  showRemoveModal(item: User): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '300px',
      data: null
    });
    dialogRef.componentInstance.title = this.strings.deleteTitle.
      replace('{data.id}', item.id.toString());
    dialogRef.componentInstance.message = this.strings.deleteMessage.
      replace('{data.id}', item.id.toString());
    dialogRef.componentInstance.yes.subscribe(async (modal: UserModalComponent) => {
      try {
        const modalItem = await this.repository.provider.delete(item.id);
      } catch (error) {
        throw error;
      }
      dialogRef.close();
    });
  }
  async customAction() {
    try {
      this.customActionRequest = { question: 'How are you?' };
      const firstUser = this.repository.provider.items.get(0);
      const result = await this.repository.provider.action(firstUser.id + '/custom-action', this.customActionRequest,
        this.mockedItems ? {
          request: (url: string, body: any) => {
            const data = { headers: {}, body: { answer: 'All is well!' } };
            return fromPromise(Promise.resolve(data));
          }
        } : undefined);
      this.customActionResponse = result;
      this.messageBoxService.info(result.answer);
    } catch (error) {
      this.customActionResponse = error.message;
      throw error;
    }
  }
  async errorAction() {
    try {
      this.errorActionRequest = { question: 'How are you?' };
      const result = await this.repository.provider.action('error-action', this.errorActionRequest,
        this.mockedItems ? {
          request: (url: string, body: any) => {
            const data = { headers: {}, body: { answer: 'All is well!' } };
            return fromPromise(Promise.reject(new Error('Big problem')));
          }
        } : undefined);
      this.errorActionResponse = result;
    } catch (error) {
      this.errorActionResponse = error.message;
      throw error;
    }
  }
}
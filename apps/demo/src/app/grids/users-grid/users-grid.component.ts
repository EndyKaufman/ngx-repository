import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { UserModalComponent } from './user-modal/user-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../shared/models/user';
import { PageEvent, MatDialog } from '@angular/material';
import { Repository, DynamicRepository } from 'ngx-repository';
import { Subject } from 'rxjs/Subject';
import { takeUntil, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { plainToClass } from 'class-transformer';
import { FormControl } from '@angular/forms';
import { ViewContainerRef } from '@angular/core';
import { MessageBoxService } from '../../others/message-box/message-box.service';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { ValidatorError } from 'ngx-repository';
import { ValidationError } from 'class-validator';

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
    private dynamicRepository: DynamicRepository,
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
      switchMap(value => this.repository.loadAll({ searchText: value }))
    ).subscribe();

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

    this.repository.items$.
      pipe(takeUntil(this.destroyed$)).
      subscribe(items => {
        this.dataSource.data = items;
      });

    this.repository.paginationMeta$.
      pipe(takeUntil(this.destroyed$)).
      subscribe(paginationMeta => {
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
  showModal(item?: User, yesWithoutFormValidationTitle?: string): void {
    if (item === undefined) {
      item = new User();
    }
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '500px',
      data: item
    });
    dialogRef.componentInstance.yesWithoutFormValidationTitle = yesWithoutFormValidationTitle;
    dialogRef.componentInstance.title = (item.id && !isNaN(+item.id) ? this.strings.updateTitle : this.strings.createTitle).
      replace('{data.id}', item.id ? item.id.toString() : '');
    dialogRef.componentInstance.yes.subscribe((modal: UserModalComponent) =>
      this.repository.save(modal.data).subscribe(modalItem => {
        if (modal.data !== undefined) {
          dialogRef.close();
        }
      }, error => {
        if (error instanceof ValidatorError) {
          const otherErrors = error.errors as ValidationError[];
          otherErrors.map(err => {
            Object.keys(err.constraints).forEach(cons => {
              err.constraints[cons] = 'custom error:' + err.constraints[cons];
            });
            return err;
          });
          modal.form.validate(otherErrors);
          modal.form.validateAllFormFields();
        } else {
          this.messageBoxService.error(error).subscribe();
        }
      })
    );
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
    dialogRef.componentInstance.yes.subscribe((modal: UserModalComponent) =>
      this.repository.delete(item.id).subscribe(modalItem =>
        dialogRef.close(),
        error =>
          this.messageBoxService.error(error).subscribe()
      )
    );
  }
  customAction() {
    this.customActionRequest = { question: 'How are you?' };
    const actionRequestOptions = this.mockedItems ? {
      request: (url: string, body: any) => {
        const data = { headers: {}, body: { answer: 'All is well!' } };
        return of(data);
      }
    } : undefined;
    const firstUser = this.repository.items[0];
    this.repository.action(
      firstUser.id + '/custom-action',
      this.customActionRequest,
      actionRequestOptions
    ).subscribe(result => {
      this.customActionResponse = result;
      this.messageBoxService.info(result.answer).subscribe();
    });
  }
  errorAction() {
    this.errorActionRequest = { question: 'How are you?' };
    const actionRequestOptions = this.mockedItems ? {
      request: (url: string, body: any) => {
        // const data = { headers: {}, body: { answer: 'All is well!' } };
        throw new Error('Big problem');
      }
    } : undefined;
    this.repository.action(
      'error-action',
      this.errorActionRequest,
      actionRequestOptions
    ).subscribe(result =>
      this.errorActionResponse = result
    );
  }
}

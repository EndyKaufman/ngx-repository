import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, PageEvent } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { plainToClass } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { IShortValidationErrors } from 'ngx-dynamic-form-builder';
import { DynamicRepository, Repository, ValidatorError } from 'ngx-repository';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MessageBoxService } from '../../others/message-box/message-box.service';
import { User } from '../../shared/models/user';
import { UserModalComponent } from './user-modal/user-modal.component';

@Component({
  selector: 'users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.scss'],
  entryComponents: [UserModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersGridComponent implements OnInit, OnDestroy {
  @ViewChild('table')
  usersGrid: UsersGridComponent;

  // todo: used only as sample, you must remove it on you project
  @Input()
  exampleCustomOptions = {};

  @Input()
  infinity: boolean;

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

    this.searchField.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(value => this.repository.loadAll({ search: value, page: 1 }))
      )
      .subscribe();

    if (this.mockedItems === undefined) {
      this.repository.useRest({
        ...{
          apiUrl: environment.apiUrl,
          pluralName: 'users',
          paginationMeta: {
            perPage: 5
          },
          infinity: this.infinity,
          ...this.exampleCustomOptions
        }
      });
    }

    if (this.mockedItems !== undefined) {
      this.repository.useMock({
        ...{
          items: this.mockedItems,
          paginationMeta: {
            perPage: 5
          },
          infinity: this.infinity
        },
        ...this.exampleCustomOptions
      });
    }

    this.repository.items$.pipe(takeUntil(this.destroyed$)).subscribe(items => {
      console.log(this.dataSource, items);
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
  onInfinityPage() {
    const paginationMeta = this.repository.paginationMeta$.getValue();
    this.repository.setOptions({
      paginationMeta: {
        curPage: paginationMeta.curPage + 1
      }
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
    dialogRef.componentInstance.title = (item.id && !isNaN(+item.id)
      ? this.strings.updateTitle
      : this.strings.createTitle
    ).replace('{data.id}', item.id ? item.id.toString() : '');
    dialogRef.componentInstance.yes.subscribe((modal: UserModalComponent) =>
      this.repository.save(modal.data).subscribe(
        modalItem => {
          if (modal.data !== undefined) {
            dialogRef.close();
          }
        },
        error => {
          if (error instanceof ValidatorError) {
            const externalErrors: IShortValidationErrors = {};
            (error.errors as ValidationError[]).map(err => {
              Object.keys(err.constraints).forEach(cons => {
                externalErrors[cons] = ['custom error:' + err.constraints[cons]];
              });
              return err;
            });
            modal.form.validate(externalErrors);
            modal.form.validateAllFormFields();
          } else {
            this.messageBoxService.error(error).subscribe();
          }
        }
      )
    );
  }
  showRemoveModal(item: User): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '300px',
      data: null
    });
    dialogRef.componentInstance.title = this.strings.deleteTitle.replace('{data.id}', item.id.toString());
    dialogRef.componentInstance.message = this.strings.deleteMessage.replace('{data.id}', item.id.toString());
    dialogRef.componentInstance.yes.subscribe((modal: UserModalComponent) =>
      this.repository.delete(item.id).subscribe(
        modalItem => {
          dialogRef.close();
        },
        error => this.messageBoxService.error(error).subscribe()
      )
    );
  }
  customAction() {
    this.customActionRequest = { question: 'How are you?' };
    const actionRequestOptions = this.mockedItems
      ? {
          request: (url: string, body: any) => {
            const data = { headers: {}, body: { answer: 'All is well!' } };
            return of(data);
          }
        }
      : undefined;
    const firstUser = this.repository.items[0];
    this.repository
      .action(firstUser.id + '/custom-action', this.customActionRequest, actionRequestOptions)
      .subscribe(result => {
        this.customActionResponse = result;
        this.messageBoxService.info(result.answer).subscribe();
      });
  }
  errorAction() {
    this.errorActionRequest = { question: 'How are you?' };
    const actionRequestOptions = this.mockedItems
      ? {
          request: (url: string, body: any) => {
            // const data = { headers: {}, body: { answer: 'All is well!' } };
            throw new Error('Big problem');
          }
        }
      : undefined;
    this.repository
      .action('error-action', this.errorActionRequest, actionRequestOptions)
      .subscribe(result => (this.errorActionResponse = result));
  }
}

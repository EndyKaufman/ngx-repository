import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, PageEvent } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { plainToClass } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { IShortValidationErrors } from 'ngx-dynamic-form-builder';
import { DynamicRepository, Repository, ValidatorError } from 'ngx-repository';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MessageBoxService } from '../../others/message-box/message-box.service';
import { Group } from '../../shared/models/group';
import { GroupModalComponent } from './group-modal/group-modal.component';

@Component({
  selector: 'groups-grid',
  templateUrl: './groups-grid.component.html',
  styleUrls: ['./groups-grid.component.scss'],
  entryComponents: [
    GroupModalComponent
  ]
})
export class GroupsGridComponent implements OnInit, OnDestroy {

  @Input()
  mockedItems?: Group[];

  // todo: used only as sample, you must remove it on you project
  @Input()
  exampleCustomOptions = {};

  searchField: FormControl;

  displayedColumns = ['select', 'id', 'name', 'title', 'action'];
  strings = Group.strings;

  dataSource = new MatTableDataSource<Group>();
  selection = new SelectionModel<Group>(true, []);
  pageEvent: PageEvent;
  repository: Repository<Group>;

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
    this.repository = this.dynamicRepository.fork<Group>(Group);
  }
  ngOnInit() {
    this.searchField = new FormControl();

    this.searchField.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value =>
        this.repository.loadAll({ searchText: value, curPage: 1 })
      )
    ).subscribe();

    if (this.mockedItems === undefined) {
      this.repository.useRest({
        ...{
          apiUrl: environment.apiUrl,
          pluralName: 'groups',
          paginationMeta: {
            perPage: 5
          }
        },
        ...this.exampleCustomOptions
      });
    }

    if (this.mockedItems !== undefined) {
      this.repository.useMock({
        ...{
          items: this.mockedItems,
          paginationMeta: {
            perPage: 5
          }
        },
        ...this.exampleCustomOptions
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  showModal(item?: Group): void {
    if (item === undefined) {
      item = new Group();
    }
    const dialogRef = this.dialog.open(GroupModalComponent, {
      width: '400px',
      data: item
    });
    dialogRef.componentInstance.title = (item.id && !isNaN(+item.id) ? this.strings.updateTitle : this.strings.createTitle).
      replace('{data.id}', item.id ? item.id.toString() : '');
    dialogRef.componentInstance.yes.subscribe((modal: GroupModalComponent) =>
      this.repository.save(modal.data).subscribe(modalItem => {
        if (modal.data !== undefined) {
          dialogRef.close();
        }
      }, error => {
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
      })
    );
  }
  showRemoveModal(item: Group): void {
    const dialogRef = this.dialog.open(GroupModalComponent, {
      width: '300px',
      data: null
    });
    dialogRef.componentInstance.title = this.strings.deleteTitle.
      replace('{data.id}', item.id.toString());
    dialogRef.componentInstance.message = this.strings.deleteMessage.
      replace('{data.id}', item.id.toString());
    dialogRef.componentInstance.yes.subscribe((modal: GroupModalComponent) =>
      this.repository.delete(item.id).subscribe(modalItem =>
        dialogRef.close(),
        error =>
          this.messageBoxService.error(error).subscribe()
      )
    );
  }
}

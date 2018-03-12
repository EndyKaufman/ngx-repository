import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { GroupModalComponent } from './group-modal/group-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { Group } from '../../shared/models/group';
import { PageEvent, MatDialog } from '@angular/material';
import { Repository, DynamicRepository } from 'ngx-repository';
import { Subject } from 'rxjs/Subject';
import { takeUntil, debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { plainToClass } from 'class-transformer';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

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
    public dynamicRepository: DynamicRepository
  ) {
    this.destroyed$ = new Subject<boolean>();
    this.repository = this.dynamicRepository.fork<Group>(Group);
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
        pluralName: 'groups',
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
      pipe(takeUntil(this.destroyed$), map(items => items.toArray())).
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
      this.repository.provider.save(modal.data).pipe(take(1)).subscribe(modalItem => {
        if (modal.data !== undefined) {
          dialogRef.close();
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
      this.repository.provider.delete(item.id).pipe(take(1)).subscribe(modalItem =>
        dialogRef.close()
      )
    );
  }
}

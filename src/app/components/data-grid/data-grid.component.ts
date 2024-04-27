import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { Observable } from 'rxjs';
import { TableColumnComponent } from '../table-column/table-column.component';
import {
  Direction,
  PaginationChangeProps,
  SortChangeProps,
} from './data-grid.types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 't-grid',
  standalone: true,
  imports: [CommonModule, TableColumnComponent, FormsModule],
  styleUrl: './data-grid.component.css',
  templateUrl: './data-grid.component.html',
})
export class DataGridComponent<T extends Record<string, string | number>> {
  constructor(private changeDetector: ChangeDetectorRef) {}

  @Input() data: T[] /*| Observable<T[]>*/ = [];
  @Input() sortable: boolean = false;
  @Input() pageSize: number | null = null;

  @Output() sortChange = new EventEmitter<SortChangeProps>();
  @Output() paginationChange = new EventEmitter<PaginationChangeProps>();

  @ContentChildren(TableColumnComponent) tableColumns:
    | QueryList<TableColumnComponent<T>>
    | undefined;

  sortedData: T[] = [];
  shownData: T[] = [];
  properties: (keyof T)[] = [];
  page: number = 1;
  previousAvailable: boolean = false;
  nextAvailable: boolean = false;
  sortedBy: keyof T | null = null;
  sortDirection: Direction = Direction.increasing;
  pages: number = 1;

  // show page
  checkNumberOfPages() {
    this.pages = Math.ceil(
      this.data.length / (this.pageSize ?? this.data.length)
    );
  }

  showPage() {
    this.checkNumberOfPages();

    this.shownData = this.sortedData.slice(
      (this.page - 1) * (this.pageSize ?? this.sortedData.length),
      this.pageSize != null ? this.pageSize * this.page : this.sortedData.length
    );
  }

  // sort data
  sortData(sortBy: keyof T) {
    if (!this.sortable) return;

    // modify sortBy and sortDirection
    if (this.sortedBy !== sortBy) {
      this.sortedBy = sortBy;
      this.sortDirection = Direction.increasing;
    } else if (this.sortDirection === Direction.increasing) {
      this.sortDirection = Direction.decreasing;
    } else {
      this.sortDirection = Direction.increasing;
    }

    this.sortedData = this.data.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return this.sortDirection === Direction.increasing ? -1 : 1;
      } else {
        return this.sortDirection === Direction.increasing ? 1 : -1;
      }
    });

    this.showPage();
    const columnName = this.tableColumns?.find(
      (column) => column.property === sortBy
    )?.name;

    if (!columnName) return;
    this.sortChange.emit({
      columnName,
      direction: this.sortDirection,
    });
  }

  // go next page
  checkNextAvailable() {
    const lastElementOnPage = this.shownData[this.shownData.length - 1];
    const lastElementIndex = this.sortedData.indexOf(lastElementOnPage);

    this.nextAvailable = lastElementIndex < this.sortedData.length - 1;
  }

  goNextPage() {
    this.page++;
    this.showPage();
    this.checkNextAvailable();
    this.checkPreviousAvailable();
  }

  // go previous page
  checkPreviousAvailable() {
    this.previousAvailable = this.page > 1;
  }

  goPreviousPage() {
    this.page--;
    this.showPage();
    this.checkPreviousAvailable();
    this.checkNextAvailable();
  }

  // change page size

  changePageSize(size: number) {
    const newPageSize = size > this.data.length ? this.data.length : size;

    this.pageSize = newPageSize;

    if (this.data.length / newPageSize <= 1) {
      this.page = 1;
    }

    this.showPage();
    this.checkNextAvailable();
    this.checkPreviousAvailable();

    this.paginationChange.emit({
      pageSize: this.pageSize,
      currentPage: this.page,
    });
  }

  onPageSizeChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;

    const inputValue = Number(event.target.value) || 1;
    this.changePageSize(inputValue);
  }

  increasePageSize() {
    if (this.pageSize == null) return;
    if (this.pageSize >= this.data.length) return;

    this.changePageSize(this.pageSize + 1);
  }

  decreasePageSize() {
    let newPageSize = this.pageSize ?? this.data.length;
    if (newPageSize <= 1) return;

    this.changePageSize(newPageSize - 1);
  }

  // on init

  ngOnInit() {
    this.sortedData = this.data;
    this.showPage();
    this.checkNextAvailable();
  }

  ngAfterViewInit() {
    if (!this.tableColumns) return;
    this.properties = this.tableColumns.map(({ property }) => property);
    this.changeDetector.detectChanges();
  }
}

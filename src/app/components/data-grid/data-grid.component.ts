import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridComponent<T extends Record<string, string | number>> {
  constructor(private changeDetector: ChangeDetectorRef) {}

  private dataSubscription: Subscription | undefined; // Added property

  @Input() data: T[] | Observable<T[]> = [];
  @Input() sortable: boolean = false;
  @Input() pageSize: number | null = null;

  @Output() sortChange = new EventEmitter<SortChangeProps>();
  @Output() paginationChange = new EventEmitter<PaginationChangeProps>();

  @ContentChildren(TableColumnComponent) tableColumns:
    | TableColumnComponent<T>[]
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
    if (this.sortedData.length === 0) {
      this.pages = 1;
    } else {
      this.pages = Math.ceil(
        this.sortedData.length / (this.pageSize ?? this.sortedData.length)
      );
    }
  }

  showPage() {
    this.checkNumberOfPages();

    this.shownData = this.sortedData.slice(
      (this.page - 1) * (this.pageSize ?? this.sortedData.length),
      this.pageSize != null ? this.pageSize * this.page : this.sortedData.length
    );
  }

  // sort data
  sortData(sortBy: keyof T, sortable: boolean) {
    if (!this.sortable || !sortable) return;

    // modify sortBy and sortDirection
    if (this.sortedBy !== sortBy) {
      this.sortedBy = sortBy;
      this.sortDirection = Direction.increasing;
    } else if (this.sortDirection === Direction.increasing) {
      this.sortDirection = Direction.decreasing;
    } else {
      this.sortDirection = Direction.increasing;
    }

    this.sortedData = this.sortedData.sort((a, b) => {
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
    if (this.page >= this.pages) return;
    this.page++;
    this.showPage();
    this.checkNextAvailable();
    this.checkPreviousAvailable();

    this.paginationChange.emit({
      pageSize: this.pageSize,
      currentPage: this.page,
    });
  }

  // go previous page
  checkPreviousAvailable() {
    this.previousAvailable = this.page > 1;
  }

  goPreviousPage() {
    if (this.page <= 1) return;
    this.page--;
    this.showPage();
    this.checkPreviousAvailable();
    this.checkNextAvailable();

    this.paginationChange.emit({
      pageSize: this.pageSize,
      currentPage: this.page,
    });
  }

  // change page size

  changePageSize(size: number) {
    const newPageSize =
      size > this.sortedData.length ? this.sortedData.length : size;

    this.pageSize = newPageSize;

    if (this.sortedData.length / newPageSize <= 1) {
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
    if (this.pageSize >= this.sortedData.length) return;

    this.changePageSize(this.pageSize + 1);
    if (this.shownData.length === 0 && this.page > 1) {
      this.checkNumberOfPages();
      this.page = this.pages;
      this.showPage();
    }
  }

  decreasePageSize() {
    let newPageSize = this.pageSize ?? this.sortedData.length;
    if (newPageSize <= 1) return;

    this.changePageSize(newPageSize - 1);
  }

  // on init

  ngOnInit() {
    if (this.data instanceof Observable) {
      // Added condition
      this.dataSubscription = this.data.subscribe((newData) => {
        // Subscribed to observable
        this.sortedData = newData.map((item) => ({ ...item }));
        this.showPage();
        this.checkNextAvailable();
        this.changeDetector.detectChanges();
      });
    } else {
      this.sortedData = this.data.map((item) => ({ ...item }));
      this.showPage();
      this.checkNextAvailable();
    }
    this.pageSize = this.pageSize ?? this.sortedData.length;
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    if (!this.tableColumns) return;
    this.properties = this.tableColumns.map(({ property }) => property);
    this.changeDetector.detectChanges();
  }
}

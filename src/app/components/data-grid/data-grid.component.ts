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
import { PaginationChangeProps, SortChangeProps } from './data-grid.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 't-grid',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './data-grid.component.css',
  templateUrl: './data-grid.component.html',
})
export class DataGridComponent<T> {
  constructor(private changeDetector: ChangeDetectorRef) {}

  @Input() data!: T[] /*| Observable<T[]>*/;
  @Input() sortable!: boolean;
  @Input() pageSize!: number | null;

  @Output() sortChange = new EventEmitter<SortChangeProps>();
  @Output() paginationChange = new EventEmitter<PaginationChangeProps>();

  @ContentChildren(TableColumnComponent) tableColumns:
    | QueryList<TableColumnComponent<T>>
    | undefined;

  properties: (keyof T)[] = [];

  ngAfterViewInit() {
    if (!this.tableColumns) return;
    this.properties = this.tableColumns.map(({ property }) => property);
    this.changeDetector.detectChanges();
  }
}

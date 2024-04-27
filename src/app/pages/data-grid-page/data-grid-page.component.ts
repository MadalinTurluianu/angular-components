import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { TableColumnComponent } from '../../components/table-column/table-column.component';
import { tableData } from '../../data/table-data';
import {
  PaginationChangeProps,
  SortChangeProps,
} from '../../components/data-grid/data-grid.types';

@Component({
  selector: 'app-data-grid-page',
  standalone: true,
  imports: [RouterOutlet, DataGridComponent, TableColumnComponent],
  templateUrl: './data-grid-page.component.html',
  styleUrl: './data-grid-page.component.css',
})
export class DataGridPageComponent {
  data = tableData;

  paginationChangedOnDataGrid(event: PaginationChangeProps) {
    console.log(event);
  }

  sortChangedOnDataGrid(event: SortChangeProps) {
    console.log(event);
  }
}

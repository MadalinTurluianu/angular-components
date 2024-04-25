import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { TableColumnComponent } from './components/table-column/table-column.component';
import { tableData } from './data/table-data';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<t-grid [data]="data" [pageSize]="10" [sortable]="true">
    <t-column name="Name" property="name" [sortable]="true" />
    <t-column name="Position" property="position" [sortable]="true" />
    <t-column name="Company" property="company" [sortable]="true" />
  </t-grid>`,
  imports: [RouterOutlet, DataGridComponent, TableColumnComponent],
})
export class AppComponent {
  data = tableData;
}

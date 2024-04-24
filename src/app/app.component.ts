import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { TableColumnComponent } from './components/table-column/table-column.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<t-grid>
    <t-column
      name="hello"
      property="property"
      [sortable]="true"
    />
    <t-column
      name="helloworld"
      property="property"
      [sortable]="true"
    />
  </t-grid>`,
  imports: [RouterOutlet, DataGridComponent, TableColumnComponent],
})
export class AppComponent {
  title = 'uipath';
}

import { Component, Input } from '@angular/core';
@Component({
  selector: 't-column',
  standalone: true,
  imports: [],
  template: `<div [attr.data-property]="property">
    {{ name }}
  </div>`,
  styleUrl: './table-column.component.css',
})
export class TableColumnComponent<T> {
  @Input() name!: string;
  @Input() property!: keyof T;
  @Input() sortable!: boolean;
}

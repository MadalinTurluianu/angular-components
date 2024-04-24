import { Component, Input } from '@angular/core';
import { DataGridProps } from './data-grid.types';

@Component({
  selector: 't-grid',
  standalone: true,
  imports: [],
  template: `<div><ng-content></ng-content></div>`,
  styleUrl: './data-grid.component.css',
})
export class DataGridComponent<T> {
  @Input() props!: DataGridProps<T>;
}

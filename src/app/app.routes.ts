import { Routes } from '@angular/router';
import { DataGridPageComponent } from './pages/data-grid-page/data-grid-page.component';

export const routes: Routes = [
  {
    path: '',
    component: DataGridPageComponent,
  },
  {
    path: 'progress-indicator',
    loadComponent: () =>
      import(
        './pages/progress-indicator-page/progress-indicator-page.component'
      ).then((component) => component.ProgressIndicatorPageComponent),
  },
];

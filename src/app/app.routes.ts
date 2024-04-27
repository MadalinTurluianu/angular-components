import { Routes } from '@angular/router';
import { DataGridPageComponent } from './pages/data-grid-page/data-grid-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/data-grid', pathMatch: 'full' },

  {
    path: 'data-grid',
    pathMatch: 'full',
    component: DataGridPageComponent,
  },

  {
    path: 'progress-indicator',
    pathMatch: 'full',
    loadComponent: () =>
      import(
        './pages/progress-indicator-page/progress-indicator-page.component'
      ).then((component) => component.ProgressIndicatorPageComponent),
  },
];

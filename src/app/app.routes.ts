import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@pages/search/search.component').then((m) => m.SearchComponent),
  },
];

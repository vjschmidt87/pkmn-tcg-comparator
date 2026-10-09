import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'prices',
    loadComponent: () => import('./features/prices/prices.component').then(m => m.PricesComponent)
  },
  {
    path: 'collections',
    loadComponent: () => import('./features/collections/collections.component').then(m => m.CollectionsComponent)
  },
  {
    path: 'collections/:setId',
    loadComponent: () => import('./features/collections/collection-detail/collection-detail.component').then(m => m.CollectionDetailComponent)
  },
  { path: '**', redirectTo: 'search' }
];

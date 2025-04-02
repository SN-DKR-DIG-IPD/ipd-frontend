import { Routes } from '@angular/router';
import {ContentLayoutComponent} from "./layout/content-layout/content-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'access-denied',
        loadChildren: () => import('./modules/access-denied/access-denied.module').then((m) => m.AccessDeniedModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard',
      },
      {
        path: '**',
        redirectTo: '/access-denied',
      },
    ],
  }
];

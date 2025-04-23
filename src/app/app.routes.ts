import { Routes } from '@angular/router';
import {ContentLayoutComponent} from "./layout/content-layout/content-layout.component";
import {AuthGuard} from "./core/guard/auth.guard";

export const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'access-denied',
        loadChildren: () => import('./modules/access-denied/access-denied.module').then((m) => m.AccessDeniedModule),
      },
      {
        path: 'demand',
        loadChildren: () => import('./modules/demand/demand.module').then((m) => m.DemandModule),
        canActivate: [AuthGuard],
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

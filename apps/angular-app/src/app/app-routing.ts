import { Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

export const routes: Routes = [
  // Route de login (non protégée)
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule)
  },
  // Routes protégées
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'demand',
        loadChildren: () => import('./modules/demand/demand.module').then((m) => m.DemandModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard',
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: ''
      },
    ]
  },
  // Redirection par défaut
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  }
];

import { Routes } from '@angular/router';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'home',
    },
    // {
    //   path: '**',
    //   pathMatch: 'full',
    //   redirectTo: 'login'
    // },
    {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
    },
    // canActivate: [AuthGuard],
     /* {
        path: 'jbpm-dashboard',
        //canActivate: [NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: 'dashboard',
        //     redirectTo: '/'
        //   }
        // },
        loadChildren: () => import('./modules/jbpm-dashboard/jbpm-dashboard.module').then((m) => m.JbpmDashboardModule)
      },*/
    {
    path: 'home',
    component: ContentLayoutComponent,
    // canActivate: [AuthGuard], // Protéger la route home - DÉSACTIVÉ TEMPORAIREMENT
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
     /* {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },*/
      {
        path: 'dashboard',
        //canActivate: [NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: 'dashboard',
        //     redirectTo: '/'
        //   }
        // },
        //loadChildren: () => import('./modules/jbpm-dashboard/jbpm-dashboard.module').then((m) => m.JbpmDashboardModule)
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      /*{
        path: 'utilisateurs',
        loadChildren: () =>
          import('./modules/user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('./modules/role/role.module').then((m) => m.RoleModule)
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/settings/settings.module').then((m) => m.SettingsModule)
      },*/
      {
        path: 'demand',
        loadChildren: () => import('./modules/demand/demand.module').then((m) => m.DemandModule)
      },
    ]
  }
];

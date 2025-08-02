import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JbpmDashboardComponent } from './jbpm-dashboard/jbpm-dashboard.component';
import {ReportingComponent} from "./reporting/reporting.component";
import {NotificationComponent} from "./notification/notification.component";
import { RoleGuard } from '../../core/guard/role.guard';

const routes: Routes = [
	{
		path: '',
		component: JbpmDashboardComponent,
		canActivate: [RoleGuard],
		data: { roles: ['SUPER_ADMIN', 'admin', 'user'] }
	},
	{
		path: ':group',
		component: JbpmDashboardComponent,
		canActivate: [RoleGuard],
		data: { roles: ['SUPER_ADMIN', 'admin', 'user'] }
	},
  {
    path : 'reporting',
    component: ReportingComponent,
    canActivate: [RoleGuard],
    data: { roles: ['SUPER_ADMIN', 'admin'] }
  },
  {
    path : 'notifications',
    component: NotificationComponent,
    canActivate: [RoleGuard],
    data: { roles: ['SUPER_ADMIN', 'admin', 'user'] }
  }
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class JbpmDashboardRoutingModule {

}

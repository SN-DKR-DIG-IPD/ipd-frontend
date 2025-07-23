import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JbpmDashboardComponent } from './jbpm-dashboard/jbpm-dashboard.component';
import {ReportingComponent} from "./reporting/reporting.component";
import {NotificationComponent} from "./notification/notification.component";


const routes: Routes = [
	{
		path: '',
		component: JbpmDashboardComponent
	},
	{
		path: ':group',
		component: JbpmDashboardComponent
	},
  {
    path : 'reporting',
    component: ReportingComponent
  },
  {
    path : 'notifications',
    component: NotificationComponent
  }
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class JbpmDashboardRoutingModule {

}

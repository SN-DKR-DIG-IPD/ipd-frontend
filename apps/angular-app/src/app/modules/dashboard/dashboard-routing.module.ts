import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UserTasksComponent } from './user-tasks.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
    data: {
      breadcrumb: 'Tableau de bord',
      title: 'Tableau de bord',
    },
	},
	{
		path: 'tasks',
		component: UserTasksComponent,
    data: {
      breadcrumb: 'Mes Tâches',
      title: 'Mes Tâches',
    },
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class DashboardRoutingModule {}

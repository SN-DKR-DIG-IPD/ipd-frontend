import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';


const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
    data: {
      breadcrumb: 'Tableau de bord',
      title: 'Tableau de bord',
    },
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class DashboardRoutingModule {}

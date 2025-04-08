import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DemandComponent} from "./demand.component";


const routes: Routes = [
	{
		path: '',
		component: DemandComponent,
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class DemandRoutingModule {}

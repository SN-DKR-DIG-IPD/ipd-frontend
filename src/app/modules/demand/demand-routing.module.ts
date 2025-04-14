import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DemandComponent} from "./demand.component";
import {OMNationaleComponent} from "./pages/omnationale/omnationale.component";
import {OMInternationaleComponent} from "./pages/ominternationale/ominternationale.component";


const routes: Routes = [
	{
		path: '',
		component: DemandComponent,
    data: {
      breadcrumb: 'Demande',
      link: 'demand'
    },
    children: [
      {
        path: 'omnationale',
        component: OMNationaleComponent,
        data: {
          breadcrumb: 'OM nationale',
        }
      },
      {
        path: 'ominternationale',
        component: OMInternationaleComponent,
        data: {
          breadcrumb: 'OM internationale',
        }
      }
    ]
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class DemandRoutingModule {}

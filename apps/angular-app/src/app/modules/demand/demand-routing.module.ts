import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OMNationaleComponent} from "./pages/omnationale/omnationale.component";
import {OMInternationaleComponent} from "./pages/ominternationale/ominternationale.component";
import {CompanionsComponent} from "./pages/companions/companions.component";
import {PerdiemComponent} from "./pages/perdiem/perdiem.component";
import {VehicleReservationComponent} from "./pages/vehicle-reservation/vehicle-reservation.component";
import {SummaryComponent} from "./pages/summary/summary.component";
import {ShuttleReservationComponent} from "./pages/shuttle-reservation/shuttle-reservation.component";
import {TicketReservationComponent} from "./pages/ticket-reservation/ticket-reservation.component";
import {DemandComponent} from "./demand.component";


const routes: Routes = [
	{
		path: '',
		component: DemandComponent,
    data: {
      link: 'demand'
    },
    children: [
      {
        path: 'omnationale',
        component: OMNationaleComponent,
        data: {
          breadcrumb: 'Nouvelle demande OM',
          title: 'OM nationale'
        }
      },
      {
        path: 'ominternationale',
        component: OMInternationaleComponent,
        data: {
          breadcrumb: 'Nouvelle demande OM',
          title: 'OM internationale'
        }
      },
      {
        path: 'companions',
        component: CompanionsComponent,
        data: {
          breadcrumb: 'Nouvelle demande OM'
        }
      },
      {
        path: 'perdiem',
        component: PerdiemComponent,
        data: {
          breadcrumb: 'Nouvelle demande OM',
        }
      },
      {
        path: 'vehicle-reservation',
        component: VehicleReservationComponent,
        data: {
          breadcrumb: 'Nouvelle demande OM',
        }
      },
      {
        path: 'ticket-reservation',
        component: TicketReservationComponent,
        data: {
          breadcrumb: 'Nouvelle demande OM',
        }
      },
      {
        path: 'shuttle-reservation',
        component: ShuttleReservationComponent,
        data: {
          breadcrumb: 'Nouvelle demande OM',
        }
      },
      {
        path: 'summary',
        component: SummaryComponent,
        data: {
          breadcrumb: 'Nouvelle demande OM',
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

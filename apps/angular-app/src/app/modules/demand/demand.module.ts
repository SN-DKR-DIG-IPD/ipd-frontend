import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DemandComponent} from "./demand.component";
import {DemandRoutingModule} from "./demand-routing.module";
import {OMNationaleComponent} from "./pages/omnationale/omnationale.component";
import {OMInternationaleComponent} from "./pages/ominternationale/ominternationale.component";
import {TimelineComponent} from "../../layout/timeline/timeline.component";
import {CompanionsComponent} from "./pages/companions/companions.component";
import {PerdiemComponent} from "./pages/perdiem/perdiem.component";
import {VehicleReservationComponent} from "./pages/vehicle-reservation/vehicle-reservation.component";
import {TicketReservationComponent} from "./pages/ticket-reservation/ticket-reservation.component";
import {ShuttleReservationComponent} from "./pages/shuttle-reservation/shuttle-reservation.component";
import {SummaryComponent} from "./pages/summary/summary.component";



@NgModule({
  declarations: [DemandComponent, OMNationaleComponent, OMInternationaleComponent, CompanionsComponent, PerdiemComponent, VehicleReservationComponent, TicketReservationComponent, ShuttleReservationComponent, SummaryComponent],
  imports: [
    CommonModule,
    DemandRoutingModule,
    TimelineComponent,
  ],
  exports: [
    OMNationaleComponent,
    OMInternationaleComponent,
    CompanionsComponent,
    PerdiemComponent, VehicleReservationComponent, TicketReservationComponent, ShuttleReservationComponent, SummaryComponent
  ]
})
export class DemandModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DemandComponent} from "./demand.component";
import {DemandRoutingModule} from "./demand-routing.module";
import {OMNationaleComponent} from "./pages/omnationale/omnationale.component";
import {OMInternationaleComponent} from "./pages/ominternationale/ominternationale.component";



@NgModule({
  declarations: [DemandComponent, OMNationaleComponent, OMInternationaleComponent],
  imports: [
    CommonModule,
    DemandRoutingModule
  ],
})
export class DemandModule { }

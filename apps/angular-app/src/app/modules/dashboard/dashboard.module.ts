import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {LucideAngularModule} from "lucide-angular";

@NgModule({
    imports: [
        SharedModule,
        DashboardRoutingModule,
        LucideAngularModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule { }

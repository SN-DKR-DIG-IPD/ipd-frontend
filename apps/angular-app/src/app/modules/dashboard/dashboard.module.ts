import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { UserTasksComponent } from './user-tasks.component';
import {LucideAngularModule, Menu, Bell, Settings} from "lucide-angular";
import { JbpmDashboardModule } from '../jbpm-dashboard/jbpm-dashboard.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        SharedModule,
        DashboardRoutingModule,
        LucideAngularModule.pick({ Menu, Bell, Settings }),
        JbpmDashboardModule,
        TranslateModule.forChild()
    ],
    declarations: [DashboardComponent, UserTasksComponent]
})
export class DashboardModule { }

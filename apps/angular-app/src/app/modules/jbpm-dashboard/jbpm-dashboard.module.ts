import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JbpmDashboardComponent } from './jbpm-dashboard/jbpm-dashboard.component';
import { DemandeComponent } from './demande/demande.component';
import { DetailComponent } from './detail/detail.component';
import { ModifComponent } from './modif/modif.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { ProcessSelectorComponent } from './process-selector/process-selector.component';
import { ListeDemandeComponent } from './liste-demande/liste-demande.component';
import { ListeInstanceDemandeComponent } from './liste-instance-demande/liste-instance-demande.component';
import { FormsModule } from '@angular/forms';
import { JbpmDashboardRoutingModule } from './jbpm-dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { ReportingComponent } from './reporting/reporting.component';
import { NotificationComponent } from './notification/notification.component';
import { DemandModule } from '../demand/demand.module';

import { TranslateModule } from "@ngx-translate/core";
import { InboxTasksComponent } from './inbox-tasks/inbox-tasks.component';


@NgModule({
    declarations: [
        JbpmDashboardComponent,
        DemandeComponent,
        DetailComponent,
        ModifComponent,
        NewRequestComponent,
        ProcessSelectorComponent,
        ListeDemandeComponent,
        ListeInstanceDemandeComponent,
        ReportingComponent,
        NotificationComponent,
        InboxTasksComponent
    ],
    providers: [SafeHtmlPipe],
    exports: [
        JbpmDashboardComponent,
        ListeInstanceDemandeComponent,
        DetailComponent,
        ProcessSelectorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        JbpmDashboardRoutingModule,
        DemandModule, // Ajouté pour accès à TaskFormComponent
        TranslateModule.forChild()
    ]
})
export class JbpmDashboardModule { }

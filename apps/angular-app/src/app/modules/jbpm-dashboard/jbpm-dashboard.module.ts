import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JbpmDashboardComponent } from './jbpm-dashboard/jbpm-dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DemandeComponent } from './demande/demande.component';
import { DetailComponent } from './detail/detail.component';
import { ModifComponent } from './modif/modif.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { ListeDemandeComponent } from './liste-demande/liste-demande.component';
import { FormsModule } from '@angular/forms';
import { JbpmDashboardRoutingModule } from './jbpm-dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { ReportingComponent } from './reporting/reporting.component';

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {HttpLoaderFactory} from "../../app.module";


@NgModule({
    declarations: [
        JbpmDashboardComponent,
        SidebarComponent,
        NavbarComponent,
        DemandeComponent,
        DetailComponent,
        ModifComponent,
        NewRequestComponent,
        ListeDemandeComponent,
        ReportingComponent
    ],
    providers: [SafeHtmlPipe],
    exports: [
        JbpmDashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        JbpmDashboardRoutingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
    ]
})
export class JbpmDashboardModule { }

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { AppComponent } from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from './shared/shared.module';
import { initKeycloak } from './core/helper/keycloak/init.keycloak';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { AppLoader } from '@jbpm/loader';
import { BPMDefaultConfigAPI, AccountAPI, ContainerAPI, ProcessInstanceAPI, TaskAPI, WorkItemsAPI, FormAPI, DiagramAPI, FrontDemandeAPI, GroupAPI, ProcessAPI, DocumentAPI } from './injections';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {LucideAngularModule} from "lucide-angular";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    KeycloakAngularModule,
    LucideAngularModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxPermissionsModule.forRoot(),
    SharedModule,
  ],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initKeycloak,
    //   deps: [KeycloakService],
    //   multi: true,
    // },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
		{ provide: BPMDefaultConfigAPI, useValue: AppLoader.getDefaultConfig() },
		{ provide: AccountAPI, useValue: AppLoader.getAccount() },
		{ provide: ContainerAPI, useValue: AppLoader.getContainer()},
		{ provide: ProcessInstanceAPI, useValue: AppLoader.getProcessInstance()},
		{ provide: ProcessAPI, useValue: AppLoader.getProcess()},
		{ provide: TaskAPI, useValue: AppLoader.getTask()},
		{ provide: WorkItemsAPI, useValue: AppLoader.getWorkItems()},
		{ provide: FormAPI, useValue: AppLoader.getForm()},
		{ provide: DiagramAPI, useValue: AppLoader.getDiagram()},
		{ provide: GroupAPI, useValue: AppLoader.getGroup()},
		{ provide: DocumentAPI, useValue: AppLoader.getDocument()},
		{ provide: FrontDemandeAPI, useValue: AppLoader.getFrontDemande()},
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }

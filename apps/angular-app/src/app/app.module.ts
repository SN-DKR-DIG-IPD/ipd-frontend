import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

// Keycloak et permissions
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NgxPermissionsModule } from 'ngx-permissions';
import { initKeycloak } from './core/helper/keycloak/init.keycloak';
import { APP_INITIALIZER } from '@angular/core';

// jBPM Loader et APIs
import { AppLoader } from '@jbpm/loader';
import { 
  BPMDefaultConfigAPI, 
  AccountAPI, 
  ContainerAPI, 
  ProcessInstanceAPI, 
  TaskAPI, 
  WorkItemsAPI, 
  FormAPI, 
  DiagramAPI, 
  FrontDemandeAPI, 
  GroupAPI, 
  ProcessAPI, 
  DocumentAPI 
} from './injections';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    NgxPermissionsModule.forRoot(),
    SharedModule
  ],
  providers: [
    // Keycloak initialization
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
    // jBPM APIs
    { provide: BPMDefaultConfigAPI, useValue: AppLoader.getDefaultConfig() },
    { provide: AccountAPI, useValue: AppLoader.getAccount() },
    { provide: ContainerAPI, useValue: AppLoader.getContainer() },
    { provide: ProcessInstanceAPI, useValue: AppLoader.getProcessInstance() },
    { provide: ProcessAPI, useValue: AppLoader.getProcess() },
    { provide: TaskAPI, useValue: AppLoader.getTask() },
    { provide: WorkItemsAPI, useValue: AppLoader.getWorkItems() },
    { provide: FormAPI, useValue: AppLoader.getForm() },
    { provide: DiagramAPI, useValue: AppLoader.getDiagram() },
    { provide: GroupAPI, useValue: AppLoader.getGroup() },
    { provide: DocumentAPI, useValue: AppLoader.getDocument() },
    { provide: FrontDemandeAPI, useValue: AppLoader.getFrontDemande() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

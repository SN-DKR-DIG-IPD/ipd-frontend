import { Component, Inject, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { AccountAPI, BPMDefaultConfigAPI} from './injections';
import type { IAccountAPI, IContainerAPI, IDefaultConfigAPI } from '@jbpm/domain';
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private keycloakService: KeycloakService,
    private permissionsService: NgxPermissionsService,
    private ngxRolesService: NgxRolesService,
		@Inject(AccountAPI) private accountAPI: IAccountAPI,
		@Inject(BPMDefaultConfigAPI) private bpmDefaultConfigAPI: IDefaultConfigAPI, private translate: TranslateService
  ) {
    translate.setDefaultLang('fr');
  }

  public async ngOnInit() {
    console.log('🚀 AppComponent: Début de ngOnInit');
    this.permissionsService.loadPermissions(['SUPER_ADMIN']);
    await (async () => {
      console.log('🔧 AppComponent: Configuration des URLs API');
      console.log('🔧 AppComponent: bpmAPIBaseUrl =', environment.bpmAPIBaseUrl);
      console.log('🔧 AppComponent: businessCentralAPIBaseUrl =', environment.businessCentralAPIBaseUrl);
      
      this.bpmDefaultConfigAPI.setAPIBaseUrl(environment.bpmAPIBaseUrl);
      this.bpmDefaultConfigAPI.setBusinessCentralAPIBaseUrl(environment.businessCentralAPIBaseUrl);
    })();
    
    // Initialiser immédiatement les headers avec fallback Basic
    console.log('🚀 AppComponent: Initialisation immédiate des headers');
    await this.initializeKeycloakHeaders();
    
    // Attendre que Keycloak soit initialisé avant de configurer les headers
    setTimeout(async () => {
      console.log('🚀 AppComponent: Réinitialisation des headers après délai');
      await this.initializeKeycloakHeaders();
    }, 2000);
  }

  private async initializeKeycloakHeaders(): Promise<void> {
    try {
      console.log('Initialisation des headers d\'authentification...');
      
      // Vérifier si Keycloak est initialisé et connecté
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      console.log('Utilisateur connecté à Keycloak:', isLoggedIn);
      
      if (isLoggedIn) {
        const keycloakInstance = this.keycloakService.getKeycloakInstance();
        if (keycloakInstance && keycloakInstance.token) {
          console.log('Token Keycloak disponible');
          const keycloakHeader = { 
            'Authorization': `Bearer ${keycloakInstance.token}`, 
            'Accept': 'application/json' 
          };
          sessionStorage.setItem('defaultHeader', JSON.stringify(keycloakHeader));
          console.log('Headers Keycloak configurés');
          return;
        }
      }
      
      // Fallback vers l'authentification Basic
      console.log('🔐 AppComponent: Utilisation de l\'authentification Basic en fallback');
      const username = 'wbadmin';
      const password = 'wbadmin';
      const basicAuth = 'Basic ' + btoa(username + ':' + password);
      const defaultHeader = { 'Authorization': basicAuth, 'Accept': 'application/json' };
      sessionStorage.setItem('defaultHeader', JSON.stringify(defaultHeader));
      console.log('🔐 AppComponent: Headers Basic configurés:', defaultHeader);
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des headers:', error);
      // Fallback vers l'authentification Basic en cas d'erreur
    const username = 'wbadmin';
    const password = 'wbadmin';
    const basicAuth = 'Basic ' + btoa(username + ':' + password);
    const defaultHeader = { 'Authorization': basicAuth, 'Accept': 'application/json' };
    sessionStorage.setItem('defaultHeader', JSON.stringify(defaultHeader));
      console.log('🔐 AppComponent: Headers Basic configurés en fallback suite à erreur:', defaultHeader);
    }
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from './core/service/user/user.service';
import { KeycloakProfile } from 'keycloak-js';
import { BPMDefaultConfigAPI } from './injections';
import type { IDefaultConfigAPI } from '@jbpm/domain';
import { environment } from '../environments/environment';
import { UnifiedAuthService } from './core/service/unified-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private userService: UserService,
    @Inject(BPMDefaultConfigAPI) private bpmDefaultConfigAPI: IDefaultConfigAPI,
    private unifiedAuthService: UnifiedAuthService
  ) { }

  public async ngOnInit() {
    // Configuration des APIs jBPM
    this.bpmDefaultConfigAPI.setAPIBaseUrl(environment.bpmAPIBaseUrl);
    this.bpmDefaultConfigAPI.setBusinessCentralAPIBaseUrl(environment.businessCentralAPIBaseUrl);

    // L'authentification et la gestion des rôles sont maintenant gérées par UnifiedAuthService
    // Pas besoin de logique Keycloak supplémentaire ici
    console.log('🚀 Application initialisée avec authentification unifiée');
  }
}

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { UnifiedAuthService } from '../service/unified-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    private unifiedAuthService: UnifiedAuthService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('🔐 Vérification d\'authentification...');
    
    // 1. Vérifier l'authentification unifiée
    if (this.unifiedAuthService.isLoggedIn()) {
      console.log('✅ Utilisateur authentifié via service unifié');
      return true;
    }

    // 2. Vérifier l'authentification Keycloak (fallback)
    if (this.authenticated) {
      console.log('✅ Utilisateur authentifié via Keycloak');
      return true;
    }

    // 3. Aucune authentification trouvée
    console.log('❌ Aucune authentification trouvée, redirection vers login');
    await this.router.navigate(['/login']);
    return false;
  }
}

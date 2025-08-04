import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { switchMap } from 'rxjs/operators';
import { UnifiedAuthService } from '../unified-auth.service';

@Injectable()
export class KeycloakAuthInterceptor implements HttpInterceptor {
  constructor(
    private keycloakService: KeycloakService,
    private unifiedAuthService: UnifiedAuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Exclure les appels d'authentification Keycloak pour éviter les conflits
    if (req.url.includes('/realms/') || req.url.includes('/protocol/openid-connect/token')) {
      console.log('🔐 Intercepteur: Exclusion de l\'appel d\'authentification Keycloak');
      return next.handle(req);
    }

    // Exclure les appels vers les assets et autres ressources statiques
    if (req.url.includes('/assets/') || req.url.includes('/clients/public')) {
      return next.handle(req);
    }

    // ✅ KEYCLOAK PARTOUT - y compris pour jBPM !
    console.log('🔐 Intercepteur: Utilisation Keycloak pour tous les appels (y compris jBPM)');
    
    // Vérifier directement le token dans localStorage
    const token = localStorage.getItem('keycloak_token');
    const isLoggedIn = this.unifiedAuthService.isLoggedIn();
    
    console.log('🔐 Intercepteur: Debug - Token existe:', !!token);
    console.log('🔐 Intercepteur: Debug - Utilisateur connecté (service):', isLoggedIn);
    console.log('🔐 Intercepteur: Debug - URL de la requête:', req.url);
    
    // Si on a un token mais que le service ne pense pas qu'on est connecté, mettre à jour l'état
    if (token && !isLoggedIn) {
      console.log('🔐 Intercepteur: Token trouvé mais service non connecté, mise à jour de l\'état...');
      // Forcer la mise à jour de l'état de connexion
      this.unifiedAuthService['isAuthenticatedSubject'].next(true);
    }
    
    if (token) {
      console.log('🔐 Intercepteur: Token trouvé, ajout du Bearer token');
      
      // ✅ RESPECTER LES HEADERS EXISTANTS ET N'AJOUTER QUE L'AUTH
      const authReq = req.clone({ 
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    } else {
      console.warn('⚠️ Intercepteur: Aucun token trouvé, requête sans authentification');
      console.warn('⚠️ Intercepteur: L\'utilisateur doit se connecter d\'abord');
      // ✅ RESPECTER LES HEADERS EXISTANTS
      return next.handle(req);
    }
  }
} 
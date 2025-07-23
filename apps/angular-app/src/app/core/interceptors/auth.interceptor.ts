import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private keycloakService: KeycloakService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Vérifier si la requête est pour jBPM
    if (request.url.includes('/jbpm/api')) {
      console.log('Intercepteur: Requête jBPM détectée:', request.url);
      
      // Vérifier les headers du sessionStorage
      const defaultHeader = sessionStorage.getItem('defaultHeader');
      if (defaultHeader) {
        try {
          const parsedHeader = JSON.parse(defaultHeader);
          if (parsedHeader.Authorization) {
            console.log('Intercepteur: Utilisation des headers du sessionStorage');
            console.log('Intercepteur: Type d\'auth:', parsedHeader.Authorization.substring(0, 10) + '...');
            const authReq = request.clone({
              setHeaders: {
                Authorization: parsedHeader.Authorization,
                Accept: parsedHeader.Accept || 'application/json'
              }
            });
            return next.handle(authReq);
          }
        } catch (error) {
          console.warn('Intercepteur: Erreur lors du parsing des headers du sessionStorage:', error);
        }
      }
      
      // Fallback vers Keycloak si pas de headers dans sessionStorage
      try {
        const keycloakInstance = this.keycloakService.getKeycloakInstance();
        if (keycloakInstance && keycloakInstance.token) {
          console.log('Intercepteur: Token Keycloak disponible');
          console.log('Intercepteur: Token Keycloak:', keycloakInstance.token.substring(0, 20) + '...');
          const authReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${keycloakInstance.token}`
            }
          });
          return next.handle(authReq);
        }
      } catch (error) {
        console.error('Intercepteur: Erreur lors de l\'ajout du token Keycloak:', error);
      }
      
      console.log('Intercepteur: Aucun token trouvé');
    }

    // Pour les autres requêtes, continuer sans modification
    return next.handle(request);
  }
} 
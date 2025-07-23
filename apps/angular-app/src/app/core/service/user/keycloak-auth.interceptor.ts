import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class KeycloakAuthInterceptor implements HttpInterceptor {
  constructor(private keycloakService: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Exclure les appels d'authentification Keycloak pour éviter les conflits
    if (req.url.includes('/realms/') || req.url.includes('/protocol/openid-connect/token')) {
      console.log('Intercepteur: Exclusion de l\'appel d\'authentification Keycloak');
      return next.handle(req);
    }

    // Exclure les appels vers les assets et autres ressources statiques
    if (req.url.includes('/assets/') || req.url.includes('/clients/public')) {
      return next.handle(req);
    }

    // Utiliser Keycloak pour tous les autres appels API
    return this.keycloakService.addTokenToHeader(req.headers).pipe(
      switchMap(headers => {
        const authReq = req.clone({ 
          headers: headers.set('Content-Type', 'application/json')
        });
        return next.handle(authReq);
      })
    );
  }
} 
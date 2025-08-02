import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  private readonly roleApiUrl = `${environment.apiUrl}/roles`;
  private readonly baseApiUrl = `${environment.businessCentralAPIBaseUrl}`;

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) { }

  // Méthode privée pour obtenir les headers Keycloak
  private getKeycloakHeaders(): HttpHeaders {
    const keycloakInstance = this.keycloakService.getKeycloakInstance();
    if (keycloakInstance && keycloakInstance.token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${keycloakInstance.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });
    }
    // Fallback si pas de token Keycloak
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  private customErrorHandler(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Non autorisé - Vérifiez votre connexion';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Rôle non trouvé';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Méthodes jBPM avec authentification Keycloak
  findAllRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}roles`, {
      headers: this.getKeycloakHeaders()
    }).pipe(
      catchError(this.customErrorHandler)
    );
  }

  getUserRoles(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}users/${username}/roles`, {
      headers: this.getKeycloakHeaders()
    }).pipe(
      catchError(this.customErrorHandler)
    );
  }

  deleteRole(roleName: string): Observable<string> {
    return this.http.delete<string>(`${this.baseApiUrl}roles/${roleName}`, {
      headers: this.getKeycloakHeaders()
    }).pipe(
      catchError(this.customErrorHandler)
    );
  }

  // Méthodes CRUD standard avec Keycloak
  findAll(): Observable<any> {
    return this.http.get(this.roleApiUrl, {
      headers: this.getKeycloakHeaders()
    }).pipe(
      catchError(this.customErrorHandler)
    );
  }

  createOrUpdate(data: any, resourceIdentity = 'roleId'): Observable<any> {
    if (data[`${resourceIdentity}`]) {
      return this.http.put(`${this.roleApiUrl}/${data[`${resourceIdentity}`]}`, data, {
        headers: this.getKeycloakHeaders()
      }).pipe(
        catchError(this.customErrorHandler)
      );
    }
    return this.http.post(this.roleApiUrl, data, {
      headers: this.getKeycloakHeaders()
    }).pipe(
      catchError(this.customErrorHandler)
    );
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete(`${this.roleApiUrl}/${id}`, {
      headers: this.getKeycloakHeaders()
    }).pipe(
      catchError(this.customErrorHandler)
    );
  }
}


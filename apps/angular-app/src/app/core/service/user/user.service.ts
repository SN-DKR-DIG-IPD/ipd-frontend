import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly userApiUrl = `${environment.apiUrl}/users`;
  private readonly baseApiUrl = `${environment.businessCentralAPIBaseUrl}`;

  private userProfile$ = new BehaviorSubject<KeycloakProfile>({});

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) { }

  // Méthodes Keycloak
  getUserProfile(): KeycloakProfile {
    return this.userProfile$.getValue();
  }

  setUserProfile(userProfile: KeycloakProfile): void {
    this.userProfile$.next(userProfile);
  }

  // Méthodes jBPM avec authentification Keycloak
  getAllUsers(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}users`, {
      headers: this.getKeycloakHeaders()
    });
  }

  getUserGroups(userName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}users/${userName}/groups`, {
      headers: this.getKeycloakHeaders()
    });
  }

  getUserRoles(userName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}users/${userName}/roles`, {
      headers: this.getKeycloakHeaders()
    });
  }

  createUserWithRolesAndGroups(name: string, roles: string[]): Observable<any> {
    const body = {
      name: name,
      roles: roles,
    };
    return this.http.post<any>(`${this.baseApiUrl}users`, body, {
      headers: this.getKeycloakHeaders()
    });
  }

  // Méthodes CRUD standard
  findAll(): Observable<any> {
    return this.http.get(this.userApiUrl, {
      headers: this.getKeycloakHeaders()
    });
  }

  createOrUpdate(data: any, resourceIdentity = 'id'): Observable<any> {
    if (data[`${resourceIdentity}`]) {
      return this.http.put(`${this.userApiUrl}/${data[`${resourceIdentity}`]}`, data, {
        headers: this.getKeycloakHeaders()
      });
    }
    return this.http.post(this.userApiUrl, data, {
      headers: this.getKeycloakHeaders()
    });
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete(this.userApiUrl + '/' + id, {
      headers: this.getKeycloakHeaders()
    });
  }

  updateUserPassword(id: string | number, pwd: string): Observable<any> {
    return this.http.put(this.userApiUrl + '/update/' + id, pwd, {
      headers: this.getKeycloakHeaders()
    });
  }

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
}

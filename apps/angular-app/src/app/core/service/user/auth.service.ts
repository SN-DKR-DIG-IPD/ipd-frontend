import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, throwError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch (e) {
    return {};
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenUrl = '/realms/atos/protocol/openid-connect/token';
  private clientId = 'atos-client';

  private token: string | null = null;
  private username: string | null = null;
  private roles$ = new BehaviorSubject<string[]>([]);
  private groups$ = new BehaviorSubject<string[]>([]);
  private username$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    // Restaure l'état depuis le stockage si présent
    const token = localStorage.getItem('keycloak_token');
    if (token) {
      this.token = token;
      this.decodeAndSetUserInfo(token);
  }
  }

  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', this.clientId)
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<any>(this.tokenUrl, body, { headers })
      .pipe(
        tap((res) => {
          if (res && res.access_token) {
            this.setSession(res.access_token, username);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let msg = 'Erreur inconnue';
          if (error.status === 0) {
            msg = 'Erreur réseau ou CORS';
          } else if (error.error && error.error.error_description) {
            msg = error.error.error_description;
          } else if (error.status === 401) {
            msg = 'Identifiants invalides';
          }
          return throwError(() => new Error(msg));
        })
    );
  }

  setSession(token: string, username: string) {
    this.token = token;
    this.username = username;
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this.username$.next(username);
    // Décodage du token pour extraire les groupes
    const payload = decodeJwt(token);
    this.roles$.next(payload.realm_access?.roles || []);
    this.groups$.next(payload.groups || []);
  }

  private decodeAndSetUserInfo(token: string) {
    const decoded = decodeJwt(token);
    // Username
    const username = decoded.preferred_username || decoded.sub || null;
    this.username = username;
    this.username$.next(username);
    // Roles (realm_access.roles ou resource_access)
    let roles: string[] = [];
    if (decoded.realm_access && Array.isArray(decoded.realm_access.roles)) {
      roles = decoded.realm_access.roles;
    } else if (decoded.realm_access && decoded.realm_access.roles) {
      roles = decoded.realm_access.roles;
    }
    this.roles$.next(roles);
    // Optionnel : groupes (si tu les utilises)
    let groups: string[] = [];
    if (Array.isArray(decoded.groups)) {
      groups = decoded.groups;
    }
    this.groups$.next(groups);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('keycloak_token');
  }

  getUsername$() {
    return this.username$.asObservable();
  }

  getRoles$() {
    return this.roles$.asObservable();
  }

  getGroups$() {
    return this.groups$.asObservable();
  }

  logout() {
    this.token = null;
    this.username = null;
    this.username$.next(null);
    this.roles$.next([]);
    this.groups$.next([]);
    localStorage.removeItem('keycloak_token');
  }
}

@Injectable({ providedIn: 'root' })
export class AuthCredentialsService {
  private credentials: { username: string; password: string } | null = null;

  setCredentials(username: string, password: string) {
    this.credentials = { username, password };
  }

  clearCredentials() {
    this.credentials = null;
  }

  getCredentials() {
    return this.credentials;
  }
} 
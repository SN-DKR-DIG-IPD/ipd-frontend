import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { NgxPermissionsService } from 'ngx-permissions';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnifiedAuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private usernameSubject = new BehaviorSubject<string | null>(null);
  private rolesSubject = new BehaviorSubject<string[]>([]);
  private groupsSubject = new BehaviorSubject<string[]>([]);

  constructor(
    private http: HttpClient,
    private router: Router,
    private keycloakService: KeycloakService,
    private permissionsService: NgxPermissionsService
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('keycloak_token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.decodeAndSetUserInfo(token);
      // ⚠️ NE PAS charger les rôles ici - Keycloak n'est peut-être pas encore initialisé
      // Les rôles seront chargés lors du login ou après initialisation de Keycloak
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  // Méthode publique pour charger les rôles après initialisation de Keycloak
  async loadRolesAfterKeycloakInit(): Promise<void> {
    if (this.isAuthenticatedSubject.value) {
      await this.loadUserRolesAndPermissions();
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      console.log('🚀 Début de l\'authentification unifiée...');
      
      // 1. Authentification via notre service personnalisé
      const config = environment.keycloak;
      const tokenUrl = `${config.issuer}realms/${config.realm}/protocol/openid-connect/token`;
      
      const body = new URLSearchParams();
      body.set('grant_type', 'password');
      body.set('client_id', config.clientId);
      body.set('username', username);
      body.set('password', password);

      const headers = new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'application/json');

      const response: any = await this.http.post(tokenUrl, body.toString(), { 
        headers,
        observe: 'response'
      }).toPromise();

      if (response.body && response.body.access_token) {
        const tokenData = response.body;
        
        // 2. Stocker les tokens
        localStorage.setItem('keycloak_token', tokenData.access_token);
        if (tokenData.refresh_token) {
          localStorage.setItem('keycloak_refresh_token', tokenData.refresh_token);
        }
        
        // 3. Synchroniser avec Keycloak silencieusement
        await this.syncWithKeycloak(tokenData.access_token, username);
        
        // 4. Charger les rôles et permissions
        await this.loadUserRolesAndPermissions();
        
        this.isAuthenticatedSubject.next(true);
        console.log('✅ Authentification unifiée réussie!');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Erreur lors de l\'authentification unifiée:', error);
      return false;
    }
  }

  private async syncWithKeycloak(token: string, username: string): Promise<void> {
    try {
      // Stocker les informations utilisateur
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('defaultHeader', JSON.stringify({
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }));

      // Décoder le token pour extraire les informations
      this.decodeAndSetUserInfo(token);
      
      console.log('✅ Synchronisation avec Keycloak réussie');
    } catch (error) {
      console.error('⚠️ Erreur lors de la synchronisation Keycloak:', error);
    }
  }

  private async loadUserRolesAndPermissions(): Promise<void> {
    try {
      // Utiliser UNIQUEMENT les rôles Keycloak via le service officiel
      const keycloakRoles = await this.keycloakService.getUserRoles();
      
      // Charger les permissions avec les rôles Keycloak
      this.permissionsService.loadPermissions(keycloakRoles);
      
      // Mettre à jour notre observable avec les rôles Keycloak
      this.rolesSubject.next(keycloakRoles);
      
      console.log('✅ Rôles Keycloak chargés via service officiel:', keycloakRoles);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des rôles Keycloak:', error);
      // Pas de fallback - rôles vides si erreur
      this.rolesSubject.next([]);
      this.permissionsService.loadPermissions([]);
    }
  }

  private decodeAndSetUserInfo(token: string): void {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      
      // Username
      const username = decoded.preferred_username || decoded.sub || null;
      this.usernameSubject.next(username);
      
      // Groupes (depuis le token JWT)
      let groups: string[] = [];
      if (Array.isArray(decoded.groups)) {
        groups = decoded.groups;
      }
      this.groupsSubject.next(groups);
      
      // RÔLES : Ne plus extraire du token JWT, utiliser uniquement Keycloak
      // Les rôles seront chargés via loadUserRolesAndPermissions()
      
    } catch (error) {
      console.error('❌ Erreur lors du décodage du token:', error);
    }
  }

  logout(): void {
    console.log('🚪 Déconnexion unifiée en cours...');
    
    // Nettoyer le stockage local
    localStorage.removeItem('keycloak_token');
    localStorage.removeItem('keycloak_refresh_token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('defaultHeader');
    
    // Nettoyer les observables
    this.isAuthenticatedSubject.next(false);
    this.usernameSubject.next(null);
    this.rolesSubject.next([]);
    this.groupsSubject.next([]);
    
    // Déconnexion Keycloak
    this.keycloakService.logout();
    
    console.log('✅ Déconnexion unifiée terminée');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('keycloak_token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Observables pour les informations utilisateur
  getUsername$(): Observable<string | null> {
    return this.usernameSubject.asObservable();
  }

  getRoles$(): Observable<string[]> {
    return this.rolesSubject.asObservable();
  }

  getGroups$(): Observable<string[]> {
    return this.groupsSubject.asObservable();
  }

  // Méthodes utilitaires
  hasRole(role: string): boolean {
    return this.rolesSubject.value.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  hasGroup(group: string): boolean {
    return this.groupsSubject.value.includes(group);
  }
} 
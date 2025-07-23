import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject } from 'rxjs';

export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  groups: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private keycloakService: KeycloakService) {
    // Ne pas initialiser automatiquement dans le constructeur
    // L'initialisation se fera à la demande
  }

  /**
   * Initialise les informations de l'utilisateur connecté
   */
  public async initializeCurrentUser(): Promise<void> {
    try {
      console.log('UserService: Début de l\'initialisation de l\'utilisateur...');
      
      // Nettoyer les anciennes informations
      this.currentUserSubject.next(null);
      
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      console.log('UserService: Utilisateur connecté à Keycloak:', isLoggedIn);
      
      if (isLoggedIn) {
        const keycloakInstance = this.keycloakService.getKeycloakInstance();
        const userProfile = await this.keycloakService.loadUserProfile();
        
        console.log('UserService: Profil utilisateur récupéré:', userProfile.username);
        
        // Récupérer les groupes depuis le token
        const token = keycloakInstance.token;
        const tokenPayload = token ? this.parseJwt(token) : {};
        
        const userInfo: UserInfo = {
          id: userProfile.id || '',
          username: userProfile.username || '',
          email: userProfile.email,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          groups: tokenPayload.groups || []
        };

        this.currentUserSubject.next(userInfo);
        console.log('UserService: Utilisateur connecté mis à jour:', userInfo);
      } else {
        console.log('UserService: Aucun utilisateur connecté');
        this.currentUserSubject.next(null);
      }
    } catch (error) {
      console.error('UserService: Erreur lors de l\'initialisation de l\'utilisateur:', error);
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Parse le JWT token pour extraire les informations
   */
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur lors du parsing du token JWT:', error);
      return {};
    }
  }

  /**
   * Récupère l'utilisateur connecté
   */
  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifie si l'utilisateur appartient à un groupe spécifique
   */
  belongsToGroup(group: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.groups.includes(group) : false;
  }

  /**
   * Filtre les tâches selon le groupe de l'utilisateur
   */
  filterTasksByUserGroup(tasks: any[]): any[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    return tasks.filter(task => {
      const taskName = task['task-name'] || '';
      
      // Logique de filtrage basée sur les groupes et noms de tâches
      if (this.belongsToGroup('PM') && taskName.includes('pmEvaluation')) {
        return true;
      }
      
      if (this.belongsToGroup('HR') && taskName.includes('hrEvaluation')) {
        return true;
      }
      
      if (this.belongsToGroup('employe') && taskName.includes('selfEvaluation')) {
        return true;
      }
      
      if (this.belongsToGroup('admin')) {
        return true; // Admin voit toutes les tâches
      }
      
      return false;
    });
  }

  /**
   * Vérifie si l'utilisateur peut accéder à une tâche spécifique
   */
  canAccessTask(taskName: string): boolean {
    const user = this.getCurrentUser();
    if (!user) {
      console.log('UserService: Aucun utilisateur connecté');
      return false;
    }

    console.log('UserService: Vérification permissions pour tâche:', taskName);
    console.log('UserService: Groupes utilisateur:', user.groups);

    // Admin peut accéder à toutes les tâches
    if (this.belongsToGroup('admin')) {
      console.log('UserService: Utilisateur admin - accès accordé');
      return true;
    }

    // Vérification basée sur le groupe et le nom de la tâche
    if (this.belongsToGroup('PM') && (taskName.includes('pmEvaluation') || taskName.includes('PM Evaluation'))) {
      console.log('UserService: Utilisateur PM - accès accordé');
      return true;
    }
    
    if (this.belongsToGroup('HR') && (taskName.includes('hrEvaluation') || taskName.includes('HR Evaluation'))) {
      console.log('UserService: Utilisateur HR - accès accordé');
      return true;
    }
    
    if (this.belongsToGroup('employe') && (taskName.includes('selfEvaluation') || taskName.includes('Self Evaluation'))) {
      console.log('UserService: Utilisateur employe - accès accordé');
      return true;
    }
    
    console.log('UserService: Aucune permission trouvée - accès refusé');
    return false;
  }

  /**
   * Obtient le formulaire correspondant au groupe de l'utilisateur
   */
  getFormForUserGroup(): string {
    const user = this.getCurrentUser();
    if (!user) return '';

    if (this.belongsToGroup('PM')) {
      return 'pmEvaluation-taskform';
    }
    
    if (this.belongsToGroup('HR')) {
      return 'hrEvaluation-taskform';
    }
    
    if (this.belongsToGroup('employe')) {
      return 'selfEvaluation-taskform';
    }
    
    return '';
  }

  /**
   * Rafraîchit les informations de l'utilisateur
   */
  async refreshUserInfo(): Promise<void> {
    await this.initializeCurrentUser();
  }

  /**
   * Déconnecte l'utilisateur
   */
  async logout(): Promise<void> {
    this.currentUserSubject.next(null);
    await this.keycloakService.logout();
  }
} 
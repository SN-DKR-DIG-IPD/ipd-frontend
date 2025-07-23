import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    // private keycloakService: KeycloakService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // Temporairement permettre l'accès sans vérification Keycloak
    console.log('AuthGuard: Accès temporairement autorisé');
    return true;
    
    // try {
    //   console.log('Vérification de l\'authentification Keycloak...');
    //   const isLoggedIn = await this.keycloakService.isLoggedIn();
    //   console.log('Utilisateur connecté:', isLoggedIn);
      
    //   if (isLoggedIn) {
    //     // Si l'utilisateur est connecté, permettre l'accès
    //     console.log('Accès autorisé');
    //     return true;
    //   } else {
    //     // Si l'utilisateur n'est pas connecté, rediriger vers la page de login
    //     console.log('Redirection vers la page de login...');
    //     this.router.navigate(['/login']);
    //     return false;
    //   }
    // } catch (error) {
    //   console.error('Erreur lors de la vérification de l\'authentification:', error);
    //   // En cas d'erreur, rediriger vers la page de login
    //   this.router.navigate(['/login']);
    //   return false;
    // }
  }
} 
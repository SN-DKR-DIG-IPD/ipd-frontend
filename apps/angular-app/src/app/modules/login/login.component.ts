import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UnifiedAuthService } from '../../core/service/unified-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private unifiedAuthService: UnifiedAuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Attendre un peu avant de vérifier l'authentification pour éviter la reconnexion automatique
    setTimeout(() => {
      this.checkExistingAuth();
    }, 500);
  }

  private checkExistingAuth(): void {
    // Vérifier si l'utilisateur est déjà connecté
    if (this.unifiedAuthService.isLoggedIn()) {
      console.log('✅ Utilisateur déjà connecté, redirection...');
      this.router.navigate(['/dashboard']);
    } else {
      console.log('ℹ️ Aucune session active, affichage du formulaire de connexion');
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;

      try {
        console.log('🚀 Début de l\'authentification unifiée...');
        
        const success = await this.unifiedAuthService.login(username, password);
        
        if (success) {
          console.log('🎉 Authentification unifiée réussie!');
          await this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = "Identifiants incorrects. Vérifiez votre nom d'utilisateur et mot de passe.";
        }
        
      } catch (error: any) {
        console.error('❌ Erreur lors de l\'authentification unifiée:', error);
        
        // Gestion des erreurs simplifiée
        if (error.status === 400) {
          if (error.error?.error === 'invalid_grant') {
            this.errorMessage = "Identifiants incorrects. Vérifiez votre nom d'utilisateur et mot de passe.";
          } else if (error.error?.error === 'unauthorized_client') {
            this.errorMessage = "Client non autorisé. Vérifiez la configuration.";
          } else {
            this.errorMessage = `Erreur: ${error.error?.error_description || 'Identifiants incorrects'}`;
          }
        } else if (error.status === 401) {
          this.errorMessage = "Authentification échouée. Vérifiez vos identifiants.";
        } else if (error.status === 404) {
          this.errorMessage = "Service Keycloak non trouvé. Vérifiez la configuration.";
        } else if (error.status === 0) {
          this.errorMessage = "Problème de connexion réseau. Vérifiez que le serveur Keycloak est accessible.";
        } else if (error.error?.error_description) {
          this.errorMessage = error.error.error_description;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = "Erreur lors de l'authentification. Vérifiez vos identifiants.";
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    private keycloakService: KeycloakService,
    private http: HttpClient
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Initialisation simple
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;

      try {
        console.log('🚀 Début de l\'authentification...');
        
        // Récupérer la configuration depuis window.__env
        const customWindow = window as any;
        
        if (!customWindow.__env || !customWindow.__env.keycloak) {
          console.error('❌ Configuration Keycloak non trouvée dans window.__env');
          console.log('window.__env:', customWindow.__env);
          throw new Error('Configuration Keycloak non trouvée');
        }

        const config = customWindow.__env.keycloak;
        
        // Log détaillé de la configuration
        console.log('📋 Configuration Keycloak:', config);
        console.log('   - Issuer:', config.issuer);
        console.log('   - Realm:', config.realm);
        console.log('   - Client ID:', config.clientId);

        // Authentification directe avec Keycloak via l'API token
        const tokenUrl = `${config.issuer}/${config.realm}/protocol/openid-connect/token`;
        console.log('🔗 URL de token complète:', tokenUrl);
        
        const body = new URLSearchParams();
        body.set('grant_type', 'password');
        body.set('client_id', config.clientId);
        body.set('username', username);
        body.set('password', password);

        console.log('📝 Paramètres de la requête:');
        console.log('   - grant_type:', body.get('grant_type'));
        console.log('   - client_id:', body.get('client_id'));
        console.log('   - username:', body.get('username'));
        console.log('   - password:', body.get('password') ? '[MASKED]' : 'undefined');

        const headers = new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'application/json');
        
        console.log('📤 Headers de la requête:', headers);
        console.log('📤 Corps de la requête:', body.toString());
        
        console.log('🔄 Envoi de la requête HTTP...');
        
        // Effectuer l'authentification directe
        const response: any = await this.http.post(tokenUrl, body.toString(), { 
          headers,
          observe: 'response'
        }).toPromise();
        
        console.log('✅ Réponse reçue!');
        console.log('📊 Status:', response.status);
        console.log('📊 Status Text:', response.statusText);
        console.log('📊 Headers de réponse:', response.headers);
        console.log('📊 Corps de réponse:', response.body);
        
        if (response.body && response.body.access_token) {
          const tokenData = response.body;
          console.log('🎉 Authentification réussie!');
          console.log('🔑 Token reçu:', tokenData.access_token ? 'OUI' : 'NON');
          console.log('🔄 Refresh Token:', tokenData.refresh_token ? 'OUI' : 'NON');
          console.log('⏰ Expires In:', tokenData.expires_in);
          
          // Stocker les tokens dans le localStorage pour la persistance
          localStorage.setItem('keycloak_token', tokenData.access_token);
          if (tokenData.refresh_token) {
            localStorage.setItem('keycloak_refresh_token', tokenData.refresh_token);
          }
          
          console.log('💾 Tokens sauvegardés dans localStorage');
          
          // Redirection directe vers la page d'accueil
          try {
            console.log('🔄 Redirection vers /home...');
            await this.router.navigate(['/home']);
          } catch (navError) {
            console.error('❌ Erreur de navigation vers /home:', navError);
            
            // Essayer une redirection alternative
            try {
              console.log('🔄 Redirection alternative vers /dashboard...');
              await this.router.navigate(['/dashboard']);
            } catch (altNavError) {
              console.error('❌ Erreur de navigation alternative:', altNavError);
            }
          }
          
        } else {
          console.error('❌ Token d\'accès non reçu dans la réponse');
          console.error('📊 Corps de réponse complet:', response.body);
          throw new Error('Token d\'accès non reçu dans la réponse');
        }
        
      } catch (error: any) {
        console.error('❌ Erreur lors de l\'authentification:', error);
        console.error('📊 Type d\'erreur:', typeof error);
        console.error('📊 Status:', error.status);
        console.error('📊 Status Text:', error.statusText);
        console.error('📊 Message:', error.message);
        console.error('📊 Error object:', error.error);
        console.error('📊 URL:', error.url);
        console.error('📊 Headers:', error.headers);
        
        if (error.status === 400) {
          console.log('🔍 Erreur 400 détectée');
          if (error.error?.error === 'invalid_grant') {
            console.log('🔍 Erreur: invalid_grant - Identifiants incorrects');
            this.errorMessage = "Identifiants incorrects ou utilisateur désactivé. Vérifiez votre nom d'utilisateur et mot de passe.";
          } else if (error.error?.error === 'unauthorized_client') {
            console.log('🔍 Erreur: unauthorized_client - Client non autorisé');
            this.errorMessage = "Client non autorisé. Vérifiez la configuration du client Keycloak.";
          } else if (error.error?.error === 'invalid_client') {
            console.log('🔍 Erreur: invalid_client - Client invalide');
            this.errorMessage = "Client invalide. Vérifiez l'ID du client dans la configuration.";
          } else {
            console.log('🔍 Erreur 400 générique:', error.error?.error_description);
            this.errorMessage = `Erreur 400: ${error.error?.error_description || 'Identifiants incorrects'}`;
          }
        } else if (error.status === 401) {
          console.log('🔍 Erreur 401 - Authentification échouée');
          this.errorMessage = "Authentification échouée. Vérifiez vos identifiants.";
        } else if (error.status === 403) {
          console.log('🔍 Erreur 403 - Accès refusé');
          this.errorMessage = "Accès refusé. Vérifiez les permissions de l'utilisateur.";
        } else if (error.status === 404) {
          console.log('🔍 Erreur 404 - Service Keycloak non trouvé');
          console.log('🔍 URL demandée:', error.url);
          this.errorMessage = "Service Keycloak non trouvé. Vérifiez la configuration.";
        } else if (error.status === 0) {
          console.log('🔍 Erreur 0 - Problème de réseau ou CORS');
          this.errorMessage = "Problème de connexion réseau ou CORS. Vérifiez que le serveur Keycloak est accessible.";
        } else if (error.error?.error_description) {
          console.log('🔍 Erreur avec description:', error.error.error_description);
          this.errorMessage = error.error.error_description;
        } else if (error.message) {
          console.log('🔍 Erreur avec message:', error.message);
          this.errorMessage = error.message;
        } else {
          console.log('🔍 Erreur générique');
          this.errorMessage = "Erreur lors de l'authentification. Vérifiez vos identifiants.";
        }
        
        this.isLoading = false;
      }
    }
  }


}

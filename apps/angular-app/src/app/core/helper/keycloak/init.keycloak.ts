import { KeycloakService } from 'keycloak-angular';

export function initKeycloak(keycloak: KeycloakService): () => Promise<any> {
  return () => {
    console.log('Début de l\'initialisation de Keycloak...');
    
    // Attendre que la configuration soit chargée
    return new Promise((resolve, reject) => {
      const checkConfig = () => {
        const customWindow = window as any;
        console.log('Vérification de la configuration...', customWindow.__env);
        
        if (customWindow.__env && customWindow.__env.keycloak) {
          console.log('Configuration Keycloak trouvée:', customWindow.__env.keycloak);
          
          // Construire l'URL correcte pour Keycloak
          // L'issuer contient déjà /realms/atos, on veut juste la base URL
          const keycloakUrl = 'http://localhost:4200';
          
          const config = {
            url: keycloakUrl,
            realm: customWindow.__env.keycloak.realm,
            clientId: customWindow.__env.keycloak.clientId,
          };
          
          console.log('Configuration Keycloak à utiliser:', config);
          
          // Initialisation simple pour vérifier la session existante
          keycloak.init({
            config: config,
            initOptions: {
              onLoad: 'check-sso',
              checkLoginIframe: false,
              pkceMethod: 'S256',
              enableLogging: true,
              silentCheckSsoFallback: true, // Permettre le fallback silencieux
              // Ajouter des options pour la persistance
              token: localStorage.getItem('keycloak_token') || undefined,
              refreshToken: localStorage.getItem('keycloak_refresh_token') || undefined
            },
            loadUserProfileAtStartUp: false, // Ne pas charger le profil automatiquement
            bearerExcludedUrls: ['/assets', '/clients/public', '/keycloak']
          }).then(async (authenticated) => {
            console.log('Keycloak initialisé avec succès, authentifié:', authenticated);
            if (authenticated) {
              try {
                const username = await keycloak.getUsername();
                console.log('Utilisateur connecté:', username);
                
                // Stocker les tokens pour la persistance
                const keycloakInstance = keycloak.getKeycloakInstance();
                if (keycloakInstance.token) {
                  localStorage.setItem('keycloak_token', keycloakInstance.token);
                }
                if (keycloakInstance.refreshToken) {
                  localStorage.setItem('keycloak_refresh_token', keycloakInstance.refreshToken);
                }
              } catch (error) {
                console.log('Erreur lors de la récupération du nom d\'utilisateur:', error);
              }
            } else {
              console.log('Utilisateur non connecté - accès autorisé sans authentification');
              // Ne pas nettoyer le stockage local pour permettre la persistance
            }
            resolve(true);
          }).catch((error) => {
            console.error('Erreur lors de l\'initialisation de Keycloak:', error);
            // En cas d'erreur, continuer quand même pour éviter la page blanche
            console.log('Continuation malgré l\'erreur Keycloak...');
            resolve(false);
          });
        } else {
          console.log('Configuration Keycloak non trouvée, nouvelle tentative dans 100ms...');
          setTimeout(checkConfig, 100);
        }
      };
      checkConfig();
    });
  };
}

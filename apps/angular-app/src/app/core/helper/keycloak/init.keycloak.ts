import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../../environments/environment';

export function initKeycloak(keycloak: KeycloakService): () => Promise<any> {
  return () => {
    console.log('🔧 Initialisation Keycloak...');
    console.log('🔧 Config Keycloak:', {
      url: environment.keycloak.issuer,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    });
    
    return keycloak.init({
      config: {
        url: environment.keycloak.issuer,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso', // Vérifier SSO sans redirection automatique
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        enableLogging: true
      }
    }).then(() => {
      console.log('✅ Keycloak initialisé avec succès');
    }).catch((error) => {
      console.error('❌ Erreur lors de l\'initialisation Keycloak:', error);
      throw error;
    });
  };
}

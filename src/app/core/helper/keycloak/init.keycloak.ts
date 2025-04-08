import { environmentDevelopment } from '../../../../environments/environment.development';
import { KeycloakService } from "keycloak-angular";

export function initKeycloak(keycloak: KeycloakService): () => Promise<any> {
  return () =>
    keycloak.init({
      config: {
        url: environmentDevelopment.keycloak.issuer,
        realm: environmentDevelopment.keycloak.realm,
        clientId: environmentDevelopment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}

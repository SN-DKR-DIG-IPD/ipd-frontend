import { KeycloakService } from "keycloak-angular";
import { environmentDevelopment } from "../../../../environments/environment.development";
import { initKeycloak } from "./init.keycloak";

describe('KeycloakService', () => {
  let keycloakService: jasmine.SpyObj<KeycloakService>;

  beforeEach(() => {
    keycloakService = jasmine.createSpyObj('KeycloakService', ['init']);
  });

  it('should initialize Keycloak with the provided configuration', () => {
    const result = initKeycloak(keycloakService);

    const promiseResult = result();

    expect(keycloakService.init).toHaveBeenCalledWith({
      config: {
        url: environmentDevelopment.keycloak.issuer,
        realm: environmentDevelopment.keycloak.realm,
        clientId: environmentDevelopment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      },
    });
  });
});

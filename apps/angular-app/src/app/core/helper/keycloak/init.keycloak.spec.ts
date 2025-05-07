import { KeycloakService } from "keycloak-angular";
import { environment } from "../../../../environments/environment";
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
        url: environment.keycloak.issuer,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      },
    });
  });
});

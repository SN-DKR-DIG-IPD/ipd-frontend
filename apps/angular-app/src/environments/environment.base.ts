import { CustomWindow } from './custom-window';

export interface IEnvironment {
  production: boolean;
    keycloak: {
      // Url of the Identity Provider
      issuer: CustomWindow['__env']['keycloak']['issuer'];

      // Realm
      realm: CustomWindow['__env']['keycloak']['realm'];

      // client
      clientId: CustomWindow['__env']['keycloak']['clientId'];
    };
    apiUrl: CustomWindow['__env']['apiUrl'];
    bpmAPIBaseUrl : CustomWindow['__env']['bpmAPIBaseUrl'];
    businessCentralAPIBaseUrl: CustomWindow['__env']['businessCentralAPIBaseUrl'];
}

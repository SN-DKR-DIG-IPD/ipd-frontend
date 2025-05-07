import { CustomWindow } from './custom-window';
import { IEnvironment } from "./environment.base";

export const environment: IEnvironment  = {
  production: false,
  keycloak: {
    // Url of the Identity Provider
    issuer: (window as unknown as CustomWindow).__env.keycloak.issuer,
    // Realm
    realm: (window as unknown as CustomWindow).__env.keycloak.realm,
    // client
    clientId: (window as unknown as CustomWindow).__env.keycloak.clientId,
  },

  apiUrl: (window as unknown as CustomWindow).__env.apiUrl,
  bpmAPIBaseUrl : (window as unknown as CustomWindow).__env.bpmAPIBaseUrl,
  businessCentralAPIBaseUrl: (window as unknown as CustomWindow).__env.businessCentralAPIBaseUrl
};



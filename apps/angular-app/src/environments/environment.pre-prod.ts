import { CustomWindow } from './custom-window';
import { IEnvironment } from './environment.base';

export const environment: IEnvironment = {
  production: true,
  keycloak: {
    issuer: (window as unknown as CustomWindow).__env.keycloak.issuer,
    realm: (window as unknown as CustomWindow).__env.keycloak.realm,
    clientId: (window as unknown as CustomWindow).__env.keycloak.clientId,
  },
  apiUrl: (window as unknown as CustomWindow).__env.apiUrl,
  bpmAPIBaseUrl: (window as unknown as CustomWindow).__env.bpmAPIBaseUrl,
  businessCentralAPIBaseUrl: (window as unknown as CustomWindow).__env.businessCentralAPIBaseUrl
};


import { CustomWindow } from './custom-window';
import { IEnvironment } from './environment.base';

export const environment: IEnvironment = {
  production: false,
  keycloak: {
    issuer: '',
    realm: '',
    clientId: ''
  },
  apiUrl: '/jbpm/api',
  bpmAPIBaseUrl: 'http://localhost:8080/kie-server/services/rest/',
  businessCentralAPIBaseUrl: 'http://localhost:8080/business-central/rest/'
};

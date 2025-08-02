import { CustomWindow } from './custom-window';
import { IEnvironment } from "./environment.base";

// Fallback si window.__env n'est pas encore chargé
const getEnvValue = (key: string, fallback: string) => {
  const env = (window as unknown as CustomWindow).__env;
  if (!env) {
    console.warn('⚠️ window.__env non défini, utilisation des valeurs par défaut');
    return fallback;
  }
  
  const keys = key.split('.');
  let value: any = env;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  
  return value || fallback;
};

export const environment: IEnvironment = {
  production: true,
      keycloak: {
      issuer: getEnvValue('keycloak.issuer', 'http://localhost:8081/'),
      realm: getEnvValue('keycloak.realm', 'atos'),
      clientId: getEnvValue('keycloak.clientId', 'atos-client'),
    },
  apiUrl: getEnvValue('apiUrl', 'http://localhost:8081'),
  bpmAPIBaseUrl: getEnvValue('bpmAPIBaseUrl', 'http://localhost:8080/kie-server/services/rest/'),
  businessCentralAPIBaseUrl: getEnvValue('businessCentralAPIBaseUrl', 'http://localhost:8080/business-central/rest/')
};

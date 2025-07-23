// Augmentation de l'interface Window pour la config dynamique
export interface CustomWindow extends Window {
  __env: {
    enableDebug: boolean;
    keycloak: {
      issuer: string;
      realm: string;
      clientId: string;
    };
    apiUrl: string;
    bpmAPIBaseUrl: string;
    businessCentralAPIBaseUrl: string;
  };
} 
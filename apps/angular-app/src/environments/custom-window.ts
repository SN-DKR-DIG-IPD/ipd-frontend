// Augmenting the Window Interface
export interface CustomWindow extends Window {
  __env: {
    enableDebug: boolean;
    keycloak: {
      // Url of the Identity Provider
      issuer: string;

      // Realm
      realm: string;

      // client
      clientId: string;
    };

    apiUrl: string;
    bpmAPIBaseUrl : string;
    businessCentralAPIBaseUrl: string;
  };
}

  // IIFE used for local dev
(function (window) {
  window.__env = window.__env || {};

  // SIS API url
  window.__env = {
    keycloak: {
      issuer: 'http://localhost:8081/',
      realm: 'atos',
      clientId: 'atos-client',
    },
    apiUrl: 'http://localhost:8081',
    bpmAPIBaseUrl: 'http://localhost:8080/kie-server/services/rest/',
    businessCentralAPIBaseUrl: 'http://localhost:8080/business-central/rest/'
  };

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
})(this);

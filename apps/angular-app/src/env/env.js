  // IIFE used for local dev
(function (window) {
  window.__env = window.__env || {};

  // SIS API url
  window.__env = {
    keycloak: {
      // URL de base du serveur Keycloak (sans /realms)
      issuer: 'http://localhost:4200/realms/atos',
      realm: 'atos',
      clientId: 'atos-client',
    },

    apiUrl: '/api',
    bpmAPIBaseUrl : '/jbpm/api/',
    businessCentralAPIBaseUrl: '/jbpm/business-central/rest/'
  };

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
})(this);
